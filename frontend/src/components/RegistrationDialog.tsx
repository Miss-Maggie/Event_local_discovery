import { useState } from "react";
import { Event } from "@/types/event";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Mail, Phone, User } from "lucide-react";
import { format } from "date-fns";

interface RegistrationDialogProps {
    event: Event;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: {
        attendee_name: string;
        attendee_email: string;
        attendee_phone?: string;
    }) => Promise<void>;
}

export default function RegistrationDialog({
    event,
    open,
    onOpenChange,
    onSubmit,
}: RegistrationDialogProps) {
    const [formData, setFormData] = useState({
        attendee_name: "",
        attendee_email: "",
        attendee_phone: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        // Validate name
        if (!formData.attendee_name.trim()) {
            newErrors.attendee_name = "Name is required";
        } else if (formData.attendee_name.trim().length < 2) {
            newErrors.attendee_name = "Name must be at least 2 characters";
        }

        // Validate email
        if (!formData.attendee_email.trim()) {
            newErrors.attendee_email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.attendee_email)) {
            newErrors.attendee_email = "Please enter a valid email address";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit({
                attendee_name: formData.attendee_name.trim(),
                attendee_email: formData.attendee_email.trim(),
                attendee_phone: formData.attendee_phone.trim() || undefined,
            });

            // Reset form and close dialog on success
            setFormData({ attendee_name: "", attendee_email: "", attendee_phone: "" });
            setErrors({});
            onOpenChange(false);
        } catch (error) {
            console.error("Registration error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Register for Event</DialogTitle>
                    <DialogDescription>
                        Complete the form below to register for this event. You'll receive a
                        confirmation email with event details.
                    </DialogDescription>
                </DialogHeader>

                {/* Event Summary */}
                <div className="bg-muted p-4 rounded-lg space-y-2">
                    <h3 className="font-semibold text-sm">{event.title}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>{format(new Date(event.date), "PPP 'at' p")}</span>
                    </div>
                </div>

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Field */}
                    <div className="space-y-2">
                        <Label htmlFor="attendee_name">
                            Full Name <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="attendee_name"
                                placeholder="Enter your full name"
                                value={formData.attendee_name}
                                onChange={(e) => handleInputChange("attendee_name", e.target.value)}
                                className={`pl-10 ${errors.attendee_name ? "border-destructive" : ""}`}
                                disabled={isSubmitting}
                            />
                        </div>
                        {errors.attendee_name && (
                            <p className="text-sm text-destructive">{errors.attendee_name}</p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <Label htmlFor="attendee_email">
                            Email Address <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="attendee_email"
                                type="email"
                                placeholder="your.email@example.com"
                                value={formData.attendee_email}
                                onChange={(e) => handleInputChange("attendee_email", e.target.value)}
                                className={`pl-10 ${errors.attendee_email ? "border-destructive" : ""}`}
                                disabled={isSubmitting}
                            />
                        </div>
                        {errors.attendee_email && (
                            <p className="text-sm text-destructive">{errors.attendee_email}</p>
                        )}
                    </div>

                    {/* Phone Field */}
                    <div className="space-y-2">
                        <Label htmlFor="attendee_phone">Phone Number (Optional)</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="attendee_phone"
                                type="tel"
                                placeholder="+1 (555) 123-4567"
                                value={formData.attendee_phone}
                                onChange={(e) => handleInputChange("attendee_phone", e.target.value)}
                                className="pl-10"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Registering..." : "Register"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
