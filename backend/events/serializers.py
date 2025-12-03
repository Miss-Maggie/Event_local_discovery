from rest_framework import serializers
from .models import Event, Category, EventRegistration
from users.serializers import UserSerializer

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class EventSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    created_by = UserSerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )
    image = serializers.SerializerMethodField()
    is_attending = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'location_name', 
            'latitude', 'longitude', 'category', 'category_id',
            'date', 'created_by', 'image', 'views', 'created_at',
            'is_attending'
        ]
    
    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

    def get_is_attending(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.attendees.filter(id=request.user.id).exists()
        return False


class EventRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for event registration with attendee details"""
    class Meta:
        model = EventRegistration
        fields = ['id', 'event', 'user', 'attendee_name', 'attendee_email', 'attendee_phone', 'registered_at']
        read_only_fields = ['id', 'event', 'user', 'registered_at']

    def validate_attendee_email(self, value):
        """Validate email format"""
        if not value or '@' not in value:
            raise serializers.ValidationError("Please provide a valid email address")
        return value.lower()

    def validate_attendee_name(self, value):
        """Validate name is not empty"""
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("Please provide a valid name (at least 2 characters)")
        return value.strip()
