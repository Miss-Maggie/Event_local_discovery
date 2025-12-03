// Home page with hero section and trending events
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrendingEvents from "@/components/TrendingEvents";
import EventCard from "@/components/EventCard";
import { eventApi } from "@/api/eventApi";
import { Event } from "@/types/event";
import { MapPin, Calendar, Users, TrendingUp } from "lucide-react";

const HomePage = () => {
  const [nearbyEvents, setNearbyEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async (lat: number, lon: number) => {
    setLoading(true);
    try {
      const events = await eventApi.getNearbyEvents(lat, lon);
      setNearbyEvents(events);
    } catch (error) {
      console.error("Error fetching nearby events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Default to Nairobi coordinates
    fetchEvents(-1.2921, 36.8219);
  }, []);

  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      // Use Nominatim for geocoding (free, no key required)
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        await fetchEvents(parseFloat(lat), parseFloat(lon));
      } else {
        // Handle location not found
        setNearbyEvents([]);
        setLoading(false);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      setLoading(false);
    }
  };

  const handleUseMyLocation = () => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchEvents(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLoading(false);
        }
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6 animate-fade-in">
                What's Happening?
              </h1>
              <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8">
                Discover local events, connect with your community, and make memories that last.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild className="bg-background text-foreground hover:bg-background/90">
                  <Link to="/events">
                    <Calendar className="mr-2 h-5 w-5" />
                    Browse Events
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="bg-background text-foreground hover:bg-background/90">
                  <Link to="/create-event">
                    <Users className="mr-2 h-5 w-5" />
                    Host an Event
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-background border-b border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">500+</div>
                <div className="text-muted-foreground">Events Listed</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-secondary">10K+</div>
                <div className="text-muted-foreground">Community Members</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-accent">50+</div>
                <div className="text-muted-foreground">Cities Covered</div>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Events */}
        <TrendingEvents />

        {/* Nearby Events */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <MapPin className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">Events Near You</h2>
              </div>

              {/* Location Search */}
              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <input
                    type="text"
                    placeholder="Enter city (e.g. Nairobi)"
                    className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const value = (e.target as HTMLInputElement).value;
                        if (value) handleSearch(value);
                      }
                    }}
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Enter city (e.g. Nairobi)"]') as HTMLInputElement;
                    if (input?.value) handleSearch(input.value);
                  }}
                >
                  Search
                </Button>
                <Button variant="secondary" onClick={handleUseMyLocation} title="Use my location">
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : nearbyEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {nearbyEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg">No upcoming events found in this area.</p>
                <p className="text-sm mt-2">Try searching for a different city or check back later!</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Discover?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of people finding amazing events in their area every day.
            </p>
            <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/register">
                Get Started Free
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
