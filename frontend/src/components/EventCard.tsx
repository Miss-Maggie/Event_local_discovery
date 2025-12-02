// Event card component to display event preview
import { Event } from "@/types/event";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  return (
    <Link to={`/events/${event.id}`}>
      <Card className="overflow-hidden hover:shadow-elevated transition-all duration-300 group h-full">
        {/* Event Image */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
            {event.category.icon} {event.category.name}
          </Badge>
        </div>

        {/* Event Details */}
        <CardContent className="p-4">
          <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {event.description}
          </p>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 text-secondary" />
              <span>{format(new Date(event.date), "MMM dd, yyyy • h:mm a")}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-secondary" />
              <span className="line-clamp-1">{event.locationName}</span>
            </div>
          </div>
        </CardContent>

        {/* Event Footer */}
        <CardFooter className="px-4 pb-4 pt-0 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>{event.views.toLocaleString()} views</span>
          </div>
          
          <span className="text-sm font-medium text-primary">
            View Details →
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default EventCard;
