// Page for creating new events
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventForm from "@/components/EventForm";
import { eventApi } from "@/api/eventApi";
import { toast } from "sonner";

const CreateEventPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    try {
      // Create FormData for image upload
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("location_name", data.locationName);
      formData.append("latitude", data.latitude.toString());
      formData.append("longitude", data.longitude.toString());
      formData.append("category", data.category);
      formData.append("date", data.date);
      
      if (data.image?.[0]) {
        formData.append("image", data.image[0]);
      }

      await eventApi.createEvent(formData);
      toast.success("Event created successfully!");
      navigate("/events");
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-background">
        {/* Header */}
        <section className="bg-gradient-hero py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-primary-foreground mb-2">
              Create New Event
            </h1>
            <p className="text-xl text-primary-foreground/90">
              Share your event with the community
            </p>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="bg-card rounded-lg shadow-elevated p-6 md:p-8">
              <EventForm onSubmit={handleSubmit} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CreateEventPage;
