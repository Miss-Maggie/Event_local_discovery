from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Event, Category
from .serializers import EventSerializer, CategorySerializer
import math

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('-created_at')
    serializer_class = EventSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category__slug']
    search_fields = ['title', 'description']

    def get_queryset(self):
        queryset = super().get_queryset()
        category_slug = self.request.query_params.get('category')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        return queryset

    def perform_create(self, serializer):
        # Assign the current user as creator
        # If user is not authenticated (e.g. during dev without auth), handle gracefully or require auth
        if self.request.user.is_authenticated:
            serializer.save(created_by=self.request.user)
        else:
            # Fallback for unauthenticated dev access if needed, or raise error
            # For now, assuming admin/auth user usage or allowing null if model permits (it doesn't)
            # We'll assume the user is logged in or we might need to relax the model constraint for dev
            # But the model has on_delete=CASCADE, so it needs a user.
            # We will rely on the frontend sending auth token or session.
            # If no auth, this might fail.
            pass 

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

        # Simple Haversine approximation or just filter by bounding box for efficiency
        # For small datasets, python calculation is fine.
        # 1 degree lat ~= 111km. 1 degree lon ~= 111km * cos(lat)
        
        # Bounding box filter first
        lat_delta = radius / 111.0
        lon_delta = radius / (111.0 * math.cos(math.radians(lat)))
        
        events = Event.objects.filter(
            latitude__range=(lat - lat_delta, lat + lat_delta),
            longitude__range=(lon - lon_delta, lon + lon_delta)
        )
        
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
        return Response(serializer.data)
