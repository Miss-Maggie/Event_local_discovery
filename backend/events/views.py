from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count
from django.core.mail import send_mail
from django.conf import settings
from .models import Event, Category, EventRegistration
from .serializers import EventSerializer, CategorySerializer, EventRegistrationSerializer
import math

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

from django.utils import timezone
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().select_related('category', 'created_by').prefetch_related('attendees').order_by('-created_at')
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category__slug', 'created_by']
    search_fields = ['title', 'description']

    def get_queryset(self):
        queryset = super().get_queryset().annotate(attendee_count_annotated=Count('attendees'))
        category_slug = self.request.query_params.get('category')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        return queryset

    def perform_create(self, serializer):
        # Assign the current user as creator
        serializer.save(created_by=self.request.user)

    @action(detail=False, methods=['get'])
    def trending(self, request):
        # Return top 3 events by views
        trending_events = self.queryset.order_by('-views')[:3]
        serializer = self.get_serializer(trending_events, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def nearby(self, request):
        try:
            lat = float(request.query_params.get('lat'))
            lon = float(request.query_params.get('lon'))
            radius = float(request.query_params.get('radius', 10))
        except (TypeError, ValueError):
            return Response(
                {"error": "Invalid parameters. lat and lon are required numbers."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Bounding box filter first
        lat_delta = radius / 111.0
        lon_delta = radius / (111.0 * math.cos(math.radians(lat)))
        
        # Filter for upcoming events only
        events = Event.objects.filter(
            latitude__range=(lat - lat_delta, lat + lat_delta),
            longitude__range=(lon - lon_delta, lon + lon_delta),
            date__gte=timezone.now()  # Only show future events
        ).order_by('date')
        
        # Refine with exact distance
        nearby_events = []
        for event in events:
            # Haversine formula
            dlat = math.radians(event.latitude - lat)
            dlon = math.radians(event.longitude - lon)
            a = (math.sin(dlat / 2) * math.sin(dlat / 2) +
                 math.cos(math.radians(lat)) * math.cos(math.radians(event.latitude)) *
                 math.sin(dlon / 2) * math.sin(dlon / 2))
            c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
            distance = 6371 * c # Radius of earth in km
            
            if distance <= radius:
                nearby_events.append(event)
                
        serializer = self.get_serializer(nearby_events, many=True)
        serializer = self.get_serializer(nearby_events, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def register(self, request, pk=None):
        """Register for an event with attendee details"""
        event = self.get_object()
        if not request.user.is_authenticated:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Check if already registered
        if EventRegistration.objects.filter(event=event, user=request.user).exists():
            return Response({"error": "Already registered for this event"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get registration data from request
        data = {
            'attendee_name': request.data.get('attendee_name'),
            'attendee_email': request.data.get('attendee_email'),
            'attendee_phone': request.data.get('attendee_phone', ''),
        }
        
        # Validate and create registration
        serializer = EventRegistrationSerializer(data=data)
        if serializer.is_valid():
            registration = serializer.save(event=event, user=request.user)
            
            # Also add to attendees for backward compatibility
            event.attendees.add(request.user)
            
            # Send confirmation email
            print(f"Attempting to send email to {registration.attendee_email}...")
            try:
                sent_count = send_mail(
                    subject=f'Registration Confirmation - {event.title}',
                    message=f'''Dear {registration.attendee_name},

Thank you for registering for {event.title}!

Event Details:
- Event: {event.title}
- Date: {event.date.strftime("%B %d, %Y at %I:%M %p")}
- Location: {event.location_name}

We look forward to seeing you there!

Best regards,
The Events Team
''',
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[registration.attendee_email],
                    fail_silently=False,  # Changed to False to see errors
                )
                print(f"Email sent successfully! Count: {sent_count}")
            except Exception as e:
                print(f"CRITICAL ERROR sending email: {e}")
                import traceback
                traceback.print_exc()
            
            return Response({
                "status": "registered",
                "is_attending": True,
                "registration": EventRegistrationSerializer(registration).data
            })
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def unregister(self, request, pk=None):
        """Unregister from an event"""
        event = self.get_object()
        if not request.user.is_authenticated:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Delete registration record
        deleted_count, _ = EventRegistration.objects.filter(event=event, user=request.user).delete()
        
        if deleted_count > 0:
            # Also remove from attendees
            event.attendees.remove(request.user)
            return Response({"status": "unregistered", "is_attending": False})
        else:
            return Response({"error": "Not registered for this event"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def registered_events(self, request):
        """Get all events the current user has registered for"""
        if not request.user.is_authenticated:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Get all event IDs where user has a registration
        registered_event_ids = EventRegistration.objects.filter(
            user=request.user
        ).values_list('event_id', flat=True)
        
        # Get the actual events
        events = Event.objects.filter(id__in=registered_event_ids).order_by('-date')
        
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def registrations(self, request, pk=None):
        """Get all registrations for a specific event (only for event creator)"""
        event = self.get_object()
        
        # Check permissions
        if not request.user.is_authenticated:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
            
        if event.created_by != request.user:
            return Response(
                {"error": "You do not have permission to view registrations for this event"}, 
                status=status.HTTP_403_FORBIDDEN
            )
            
        # Get registrations
        registrations = EventRegistration.objects.filter(event=event).order_by('-registered_at')
        serializer = EventRegistrationSerializer(registrations, many=True)
        return Response(serializer.data)
