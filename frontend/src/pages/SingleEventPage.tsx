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
import RegistrationDialog from "@/components/RegistrationDialog";

const SingleEventPage = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);

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

  const handleRegister = async (data: {
    attendee_name: string;
    attendee_email: string;
    attendee_phone?: string;
  }) => {
    if (!event) return;

    try {
      await eventApi.registerEvent(event.id, data);
      setEvent({ ...event, is_attending: true });
      toast.success("Successfully registered for event! Check your email for confirmation.");
    } catch (error: any) {
      console.error("Error registering for event:", error);
      const errorMessage = error.response?.data?.error || "Failed to register for event";
      toast.error(errorMessage);
      throw error; // Re-throw to let dialog handle it
    }
  };

  const handleUnregister = async () => {
    if (!event) return;

    try {
      await eventApi.unregisterEvent(event.id);
      setEvent({ ...event, is_attending: false });
      toast.success("Unregistered from event");
    } catch (error) {
      console.error("Error unregistering from event:", error);
      toast.error("Failed to unregister from event");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground">Event not found</p>
          <Button className="mt-4" asChild>
            <Link to="/events">Browse Events</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6">
              {/* Event Image */}
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}

              {/* Event Title and Category */}
              <div className="mb-4">
                <Badge className="mb-2">{event.category.name}</Badge>
                <h1 className="text-3xl font-bold">{event.title}</h1>
              </div>

              {/* Event Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="mr-2 h-5 w-5" />
                  <span>{format(new Date(event.date), "PPP 'at' p")}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="mr-2 h-5 w-5" />
                  <span>{event.location_name}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <User className="mr-2 h-5 w-5" />
                  <span>Organized by {event.created_by.username}</span>
                </div>
              </div>

              {/* Event Description */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">About this event</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{event.description}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className={event.is_attending ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "bg-primary text-primary-foreground hover:bg-primary/90"}
                  onClick={() => {
                    if (event.is_attending) {
                      handleUnregister();
                    } else {
                      const token = localStorage.getItem("access_token");
                      if (!token) {
                        toast.error("Please log in to register for events");
                        return;
                      }
                      setShowRegistrationDialog(true);
                    }
                  }}
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  {event.is_attending ? "Unregister from Event" : "Register for Event"}
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

      {/* Registration Dialog */}
      {event && (
        <RegistrationDialog
          event={event}
          open={showRegistrationDialog}
          onOpenChange={setShowRegistrationDialog}
          onSubmit={handleRegister}
        />
      )}
    </div>
  );
};

export default SingleEventPage;
