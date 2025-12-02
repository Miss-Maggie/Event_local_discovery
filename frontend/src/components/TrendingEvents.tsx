// Trending events section component
import { useEffect, useState } from "react";
import { Event } from "@/types/event";
import { eventApi } from "@/api/eventApi";
import EventCard from "./EventCard";
import { TrendingUp } from "lucide-react";

const TrendingEvents = () => {
  const [trendingEvents, setTrendingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const events = await eventApi.getTrendingEvents();
        setTrendingEvents(events);
      } catch (error) {
        console.error("Error fetching trending events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="h-8 w-8 text-secondary" />
          <h2 className="text-3xl font-bold text-foreground">Trending Now</h2>
        </div>

        {/* Trending Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingEvents;
