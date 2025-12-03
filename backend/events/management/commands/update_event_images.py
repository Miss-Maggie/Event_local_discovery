from django.core.management.base import BaseCommand
from events.models import Event
import os


class Command(BaseCommand):
    help = 'Update event images based on event titles'

    def handle(self, *args, **kwargs):
        # Mapping of event title keywords to image filenames
        image_mapping = {
            'art': 'event_images/art_exhibition.png',
            'exhibition': 'event_images/art_exhibition.png',
            'business': 'event_images/business.jpg',
            'comedy': 'event_images/comedy_night.jpg',
            'farmers': 'event_images/farmers_night.jpg',
            'farm': 'event_images/farmers_night.jpg',
            'food': 'event_images/food_festival.png',
            'festival': 'event_images/food_festival.png',
            'forest': 'event_images/forest_walk.png',
            'walk': 'event_images/forest_walk.png',
            'hiking': 'event_images/forest_walk.png',
            'jazz': 'event_images/jazz_festival.png',
            'music': 'event_images/jazz_festival.png',
            'marathon': 'event_images/marathon.png',
            'run': 'event_images/marathon.png',
            'race': 'event_images/marathon.png',
            'networking': 'event_images/networking_mixer.png',
            'mixer': 'event_images/networking_mixer.png',
            'tech': 'event_images/tech_summit.png',
            'summit': 'event_images/tech_summit.png',
            'technology': 'event_images/tech_summit.png',
        }

        events = Event.objects.all()
        updated_count = 0
        
        for event in events:
            # Check if event already has an image
            if event.image:
                self.stdout.write(
                    self.style.WARNING(f'Event "{event.title}" already has an image: {event.image}')
                )
                continue
            
            # Try to match event title to an image
            title_lower = event.title.lower()
            matched = False
            
            for keyword, image_path in image_mapping.items():
                if keyword in title_lower:
                    event.image = image_path
                    event.save()
                    updated_count += 1
                    matched = True
                    self.stdout.write(
                        self.style.SUCCESS(f'✓ Updated "{event.title}" with {image_path}')
                    )
                    break
            
            if not matched:
                self.stdout.write(
                    self.style.WARNING(f'⚠ No matching image found for "{event.title}"')
                )
        
        self.stdout.write(
            self.style.SUCCESS(f'\n✅ Successfully updated {updated_count} event(s)')
        )
