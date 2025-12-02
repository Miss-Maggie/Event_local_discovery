from rest_framework import serializers
from .models import Event, Category
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

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'location_name', 
            'latitude', 'longitude', 'category', 'category_id',
            'date', 'created_by', 'image', 'views', 'created_at'
        ]
