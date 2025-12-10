
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventForm from "@/components/EventForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { eventApi } from "@/api/eventApi";
import { Event } from "@/types/event";
import { toast } from "sonner";
import { MapPin, Calendar, Trash2, Users, Edit, RefreshCcw } from "lucide-react";
import { format } from "date-fns";

interface Registration {
    id: number;
    attendee_name: string;
    attendee_email: string;
    attendee_phone?: string;
    registered_at: string;
}

const ManageEventPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [event, setEvent] = useState<Event | null>(null);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingRegistrations, setLoadingRegistrations] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchEventData = async () => {
            try {
                const eventData = await eventApi.getEvent(Number(id));
                setEvent(eventData);

                // Load registrations initially too
                loadRegistrations(Number(id));
            } catch (error) {
                console.error("Error fetching event:", error);
                toast.error("Could not load event details");
                navigate("/profile");
            } finally {
                setLoading(false);
            }
        };

        fetchEventData();
    }, [id, navigate]);

    const loadRegistrations = async (eventId: number) => {
        setLoadingRegistrations(true);
        try {
            const data = await eventApi.getEventRegistrations(eventId);
            setRegistrations(data);
        } catch (error) {
            console.error("Error loading registrations:", error);
            // Don't show error toast on 403 (if not owner), just fail silently or handle gracefully
            // But since we are likely the owner if we are on this page (checked in Profile), it *should* work.
        } finally {
            setLoadingRegistrations(false);
        }
    };

    const handleUpdateEvent = async (data: any) => {
        if (!event) return;
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("location_name", data.locationName);
            formData.append("latitude", data.latitude.toString());
            formData.append("longitude", data.longitude.toString());
            formData.append("category_id", data.category);
            formData.append("date", data.date);

            if (data.image?.[0]) {
                formData.append("image", data.image[0]);
            }

            const updatedEvent = await eventApi.updateEvent(event.id, formData);
            setEvent(updatedEvent);
            toast.success("Event updated successfully!");
        } catch (error) {
            console.error("Error updating event:", error);
            toast.error("Failed to update event.");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteEvent = async () => {
        if (!event) return;
        try {
            await eventApi.deleteEvent(event.id);
            toast.success("Event deleted successfully");
            navigate("/profile");
        } catch (error) {
            console.error("Error deleting event:", error);
            toast.error("Failed to delete event");
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

    if (!event) return null;

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-1">
                {/* Header */}
                <section className="bg-muted py-8 border-b">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground mb-2">Manage Event</h1>
                                <p className="text-muted-foreground flex items-center gap-2">
                                    <span className="font-semibold text-foreground">{event.title}</span>
                                </p>
                            </div>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete Event
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the event
                                            "{event.title}" and remove all data associated with it.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDeleteEvent} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </section>

                <section className="py-8">
                    <div className="container mx-auto px-4">
                        <Tabs defaultValue="details" className="w-full">
                            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
                                <TabsTrigger value="details">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Details
                                </TabsTrigger>
                                <TabsTrigger value="attendees">
                                    <Users className="mr-2 h-4 w-4" />
                                    Attendees ({registrations.length})
                                </TabsTrigger>
                            </TabsList>

                            {/* Edit Details Tab */}
                            <TabsContent value="details">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Event Details</CardTitle>
                                        <CardDescription>
                                            Update your event information here.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <EventForm
                                            isLoading={saving}
                                            onSubmit={handleUpdateEvent}
                                            initialData={{
                                                title: event.title,
                                                description: event.description,
                                                locationName: event.location_name,
                                                latitude: event.latitude,
                                                longitude: event.longitude,
                                                category: event.category?.slug,
                                                date: event.date.slice(0, 16), // Format for datetime-local
                                            }}
                                        />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Attendees Tab */}
                            <TabsContent value="attendees">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <div>
                                            <CardTitle>Registered Attendees</CardTitle>
                                            <CardDescription>
                                                People who have signed up for your event.
                                            </CardDescription>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => loadRegistrations(event.id)}>
                                            <RefreshCcw className={`h-4 w-4 mr-2 ${loadingRegistrations ? 'animate-spin' : ''}`} />
                                            Refresh
                                        </Button>
                                    </CardHeader>
                                    <CardContent>
                                        {registrations.length > 0 ? (
                                            <div className="rounded-md border">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Name</TableHead>
                                                            <TableHead>Email</TableHead>
                                                            <TableHead>Phone</TableHead>
                                                            <TableHead>Registered At</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {registrations.map((reg) => (
                                                            <TableRow key={reg.id}>
                                                                <TableCell className="font-medium">{reg.attendee_name}</TableCell>
                                                                <TableCell>{reg.attendee_email}</TableCell>
                                                                <TableCell>{reg.attendee_phone || "-"}</TableCell>
                                                                <TableCell>{format(new Date(reg.registered_at), "PPp")}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 text-muted-foreground">
                                                <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                                <p>No attendees have registered yet.</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default ManageEventPage;
