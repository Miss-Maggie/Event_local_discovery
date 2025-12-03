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
    image = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'location_name', 
            'latitude', 'longitude', 'category', 'category_id',
            'date', 'created_by', 'image', 'views', 'created_at'
        ]
    
    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
