// API functions for events
import axiosClient from "./axiosClient";
import { Event, Category } from "@/types/event";

export const eventApi = {
  // Get all events
  getEvents: async (params?: {
    category?: string;
    search?: string;
    lat?: number;
    lon?: number;
    radius?: number;
  }): Promise<Event[]> => {
    const response = await axiosClient.get("/events/", { params });
    return response.data;
  },

  // Get single event by ID
  getEvent: async (id: number): Promise<Event> => {
    const response = await axiosClient.get(`/events/${id}/`);
    return response.data;
  },

  // Get trending events
  getTrendingEvents: async (): Promise<Event[]> => {
    const response = await axiosClient.get("/events/trending/");
    return response.data;
  },

  // Get nearby events
  getNearbyEvents: async (lat: number, lon: number, radius: number = 10): Promise<Event[]> => {
    const response = await axiosClient.get("/events/nearby/", {
      params: { lat, lon, radius }
    });
    return response.data;
  },

  // Create new event
  createEvent: async (eventData: FormData): Promise<Event> => {
    const response = await axiosClient.post("/events/", eventData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  },

  // Update event
  updateEvent: async (id: number, eventData: FormData): Promise<Event> => {
    const response = await axiosClient.put(`/events/${id}/`, eventData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  },

  // Delete event
  deleteEvent: async (id: number): Promise<void> => {
    await axiosClient.delete(`/events/${id}/`);
  },

  getCategories: async (): Promise<Category[]> => {
    const response = await axiosClient.get("/categories/");
    return response.data;
  },

  // Register for event
  registerEvent: async (
    id: number,
    data: {
      attendee_name: string;
      attendee_email: string;
      attendee_phone?: string;
    }
  ): Promise<{ status: string; is_attending: boolean }> => {
    const response = await axiosClient.post(`/events/${id}/register/`, data);
    return response.data;
  },

  // Unregister from event
  unregisterEvent: async (id: number): Promise<{ status: string; is_attending: boolean }> => {
    const response = await axiosClient.post(`/events/${id}/unregister/`);
    return response.data;
  },

  // Get events the user has registered for
  getRegisteredEvents: async (): Promise<Event[]> => {
    const response = await axiosClient.get("/events/registered_events/");
    return response.data;
  },
};
