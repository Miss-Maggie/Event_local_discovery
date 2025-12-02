// Single event details page
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { eventApi } from "@/api/eventApi";
import { Event } from "@/types/event";
import { Calendar, MapPin, Eye, User, Share2, Heart } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const SingleEventPage = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;

      try {
        const eventData = await eventApi.getEvent(parseInt(id));
        setEvent(eventData);
      } catch (error) {
        console.error("Error fetching event:", error);
        toast.error("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: event?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center py-20">
          <h1 className="text-3xl font-bold text-foreground mb-4">Event Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/events">Back to Events</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Image */}
        <div className="relative h-[400px] overflow-hidden">
          {event.image ? (
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30 flex items-center justify-center">
              <div className="text-center p-8">
                <Calendar className="h-24 w-24 mx-auto mb-4 text-primary/60" />
                <h2 className="text-2xl font-bold text-foreground/80">{event.title}</h2>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>

        {/* Event Details */}
        <div className="container mx-auto px-4 -mt-20 relative z-10 pb-12">
          <Card className="shadow-elevated">
            <CardContent className="p-8">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <Badge className="bg-primary text-primary-foreground">
                    {event.category.icon} {event.category.name}
                  </Badge>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <h1 className="text-4xl font-bold text-foreground mb-4">
                  {event.title}
                </h1>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span>{event.views.toLocaleString()} views</span>
                </div>
              </div>

              {/* Event Info Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-secondary mt-1" />
                    <div>
                      <div className="font-semibold text-foreground">Date & Time</div>
                      <div className="text-muted-foreground">
                        {format(new Date(event.date), "EEEE, MMMM dd, yyyy")}
                        <br />
                        {format(new Date(event.date), "h:mm a")}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-secondary mt-1" />
                    <div>
                      <div className="font-semibold text-foreground">Location</div>
                      <div className="text-muted-foreground">{event.locationName}</div>
                      <div className="text-sm text-muted-foreground">
                        {event.latitude.toFixed(4)}, {event.longitude.toFixed(4)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-secondary mt-1" />
                    <div>
                      <div className="font-semibold text-foreground">Organized by</div>
                      <div className="text-muted-foreground">
                        {event.createdBy.firstName} {event.createdBy.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        @{event.createdBy.username}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">About This Event</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Calendar className="mr-2 h-5 w-5" />
                  Register for Event
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/events">Browse More Events</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SingleEventPage;
