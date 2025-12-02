// User profile page
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockUser, mockEvents } from "@/data/mockData";
import { Event } from "@/types/event";
import { User, MapPin, Calendar, Edit } from "lucide-react";

const ProfilePage = () => {
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [attendingEvents, setAttendingEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Mock data - filter events created by user
    setMyEvents(mockEvents.filter(e => e.createdBy.id === mockUser.id));
    // Mock attending events
    setAttendingEvents(mockEvents.slice(0, 2));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-background">
        {/* Profile Header */}
        <section className="bg-gradient-hero py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <img
                src={mockUser.avatar}
                alt={mockUser.username}
                className="w-32 h-32 rounded-full border-4 border-primary-foreground shadow-lg"
              />

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-primary-foreground mb-2">
                  {mockUser.firstName} {mockUser.lastName}
                </h1>
                <p className="text-xl text-primary-foreground/80 mb-4">
                  @{mockUser.username}
                </p>
                <p className="text-primary-foreground/90">{mockUser.email}</p>
              </div>

              {/* Edit Button */}
              <Button variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-8 bg-muted/30 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-3 gap-4 max-w-2xl">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{myEvents.length}</div>
                <div className="text-sm text-muted-foreground">Events Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">{attendingEvents.length}</div>
                <div className="text-sm text-muted-foreground">Attending</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">0</div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </div>
            </div>
          </div>
        </section>

        {/* Events Tabs */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="my-events" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
                <TabsTrigger value="my-events">
                  <Calendar className="mr-2 h-4 w-4" />
                  My Events
                </TabsTrigger>
                <TabsTrigger value="attending">
                  <MapPin className="mr-2 h-4 w-4" />
                  Attending
                </TabsTrigger>
              </TabsList>

              {/* My Events Tab */}
              <TabsContent value="my-events" className="space-y-6">
                {myEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-lg text-muted-foreground mb-4">
                        You haven't created any events yet
                      </p>
                      <Button asChild className="bg-primary text-primary-foreground">
                        <a href="/create-event">Create Your First Event</a>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Attending Tab */}
              <TabsContent value="attending" className="space-y-6">
                {attendingEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {attendingEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-lg text-muted-foreground mb-4">
                        You're not attending any events yet
                      </p>
                      <Button asChild className="bg-primary text-primary-foreground">
                        <a href="/events">Browse Events</a>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
