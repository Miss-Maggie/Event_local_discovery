from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from events.models import Event, Category, Ticket
from users.models import CustomUser


class Command(BaseCommand):
    help = 'Seeds the database with sample Nairobi events'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding database with Nairobi events...')

        # Get or create a default user for events
        user, created = CustomUser.objects.get_or_create(
            email='admin@events.com',
            defaults={
                'username': 'eventadmin',
                'first_name': 'Event',
                'last_name': 'Admin',
                'is_staff': True,
            }
        )
        if created:
            user.set_password('admin123')
            user.save()
            self.stdout.write(self.style.SUCCESS(f'Created user: {user.email}'))

        # Create categories
        categories_data = [
            {'name': 'Music', 'slug': 'music'},
            {'name': 'Sports', 'slug': 'sports'},
            {'name': 'Technology', 'slug': 'technology'},
            {'name': 'Food & Drink', 'slug': 'food-drink'},
            {'name': 'Arts & Culture', 'slug': 'arts-culture'},
            {'name': 'Business', 'slug': 'business'},
            {'name': 'Networking', 'slug': 'networking'},
        ]

        categories = {}
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(**cat_data)
            categories[cat_data['name']] = category
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created category: {category.name}'))

        # Sample Nairobi events with images
        events_data = [
            {
                'title': 'Nairobi Jazz Festival 2025',
                'description': 'Experience the best of jazz music with local and international artists at the iconic Uhuru Gardens. Enjoy an evening of smooth jazz, food trucks, and great vibes.',
                'location_name': 'Uhuru Gardens, Nairobi',
                'latitude': -1.3028,
                'longitude': 36.7828,
                'category': categories['Music'],
                'date': timezone.now() + timedelta(days=7),
                'price': 2500.00,
                'quantity': 500,
                'image': 'event_images/jazz_festival.png',
            },
            {
                'title': 'Nairobi Tech Summit 2025',
                'description': 'Join Kenya\'s largest tech conference featuring keynotes from industry leaders, startup pitches, and networking opportunities. Topics include AI, blockchain, and fintech.',
                'location_name': 'KICC, Nairobi',
                'latitude': -1.2921,
                'longitude': 36.8219,
                'category': categories['Technology'],
                'date': timezone.now() + timedelta(days=14),
                'price': 5000.00,
                'quantity': 1000,
                'image': 'event_images/tech_summit.png',
            },
            {
                'title': 'Karura Forest Nature Walk',
                'description': 'Guided nature walk through Karura Forest. Learn about local flora and fauna, enjoy bird watching, and explore the beautiful waterfalls. Perfect for families!',
                'location_name': 'Karura Forest, Nairobi',
                'latitude': -1.2507,
                'longitude': 36.8333,
                'category': categories['Sports'],
                'date': timezone.now() + timedelta(days=3),
                'price': 500.00,
                'quantity': 50,
                'image': 'event_images/forest_walk.png',
            },
            {
                'title': 'Nairobi Food Festival',
                'description': 'Taste the best of Kenyan and international cuisine at this food festival. Over 50 vendors, live cooking demonstrations, and celebrity chef appearances.',
                'location_name': 'Two Rivers Mall, Nairobi',
                'latitude': -1.2116,
                'longitude': 36.8058,
                'category': categories['Food & Drink'],
                'date': timezone.now() + timedelta(days=10),
                'price': 1000.00,
                'quantity': 800,
                'image': 'event_images/food_festival.png',
            },
            {
                'title': 'Art Exhibition: Contemporary Kenya',
                'description': 'Explore works from Kenya\'s most talented contemporary artists. Paintings, sculptures, and digital art showcasing modern Kenyan culture and society.',
                'location_name': 'National Museum of Kenya',
                'latitude': -1.2674,
                'longitude': 36.8172,
                'category': categories['Arts & Culture'],
                'date': timezone.now() + timedelta(days=5),
                'price': 800.00,
                'quantity': 200,
                'image': 'event_images/art_exhibition.png',
            },
            {
                'title': 'Startup Networking Mixer',
                'description': 'Connect with fellow entrepreneurs, investors, and innovators. Pitch your ideas, find co-founders, and build valuable relationships in Nairobi\'s startup ecosystem.',
                'location_name': 'iHub, Nairobi',
                'latitude': -1.2921,
                'longitude': 36.7856,
                'category': categories['Networking'],
                'date': timezone.now() + timedelta(days=2),
                'price': 1500.00,
                'quantity': 100,
                'image': 'event_images/networking_mixer.png',
            },
            {
                'title': 'Nairobi Marathon 2025',
                'description': 'Join thousands of runners in Kenya\'s premier marathon event. Full marathon, half marathon, and 10K options available. All proceeds go to charity.',
                'location_name': 'Nyayo National Stadium',
                'latitude': -1.3013,
                'longitude': 36.8297,
                'category': categories['Sports'],
                'date': timezone.now() + timedelta(days=21),
                'price': 2000.00,
                'quantity': 5000,
                'image': 'event_images/marathon.png',
            },
            {
                'title': 'Business Leadership Conference',
                'description': 'Learn from top CEOs and business leaders about strategy, innovation, and leadership. Includes workshops, panel discussions, and networking sessions.',
                'location_name': 'Radisson Blu Hotel, Nairobi',
                'latitude': -1.2884,
                'longitude': 36.8233,
                'category': categories['Business'],
                'date': timezone.now() + timedelta(days=12),
                'price': 8000.00,
                'quantity': 300,
                'image': 'event_images/business.jpg',
            },
            {
                'title': 'Nairobi Comedy Night',
                'description': 'Laugh out loud with Kenya\'s funniest comedians! An evening of stand-up comedy, music, and entertainment. Bring your friends for a night to remember.',
                'location_name': 'Kenya National Theatre',
                'latitude': -1.2809,
                'longitude': 36.8258,
                'category': categories['Arts & Culture'],
                'date': timezone.now() + timedelta(days=4),
                'price': 1200.00,
                'quantity': 400,
                'image': 'event_images/comedy_night.jpg',             },
            {
                'title': 'Weekend Farmers Market',
                'description': 'Fresh organic produce, artisanal products, and local crafts. Support local farmers and enjoy live music while you shop for healthy, sustainable food.',
                'location_name': 'Karura Forest Gate',
                'latitude': -1.2507,
                'longitude': 36.8333,
                'category': categories['Food & Drink'],
                'date': timezone.now() + timedelta(days=1),
                'price': 0.00,  # Free event
                'quantity': 1000,
                'image': 'event_images/farmers_night.jpg',  
            },
        ]

        # Create events
        for event_data in events_data:
            price = event_data.pop('price')
            quantity = event_data.pop('quantity')
            
            event, created = Event.objects.get_or_create(
                title=event_data['title'],
                defaults={
                    **event_data,
                    'created_by': user,
                }
            )
            
            if created:
                # Create ticket for the event
                Ticket.objects.create(
                    event=event,
                    price=price,
                    quantity=quantity,
                    sold=0
                )
                self.stdout.write(self.style.SUCCESS(f'Created event: {event.title}'))
            else:
                self.stdout.write(self.style.WARNING(f'Event already exists: {event.title}'))

        self.stdout.write(self.style.SUCCESS('\n✅ Database seeding completed!'))
        self.stdout.write(self.style.SUCCESS(f'Total events: {Event.objects.count()}'))
        self.stdout.write(self.style.SUCCESS(f'Total categories: {Category.objects.count()}'))
