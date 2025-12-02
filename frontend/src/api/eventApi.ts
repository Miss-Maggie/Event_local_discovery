// API functions for events - currently using mock data
// Replace with actual axiosClient calls when Django backend is ready

import axiosClient from "./axiosClient";
import { mockEvents, mockCategories } from "@/data/mockData";
import { Event, Category } from "@/types/event";

// Mock mode flag - set to false when Django backend is ready
const USE_MOCK_DATA = false;  // use rea API

export const eventApi = {
  // Get all events
  getEvents: async (params?: {
    category?: string;
    search?: string;
    lat?: number;
    lon?: number;
    radius?: number;
  }): Promise<Event[]> => {
    if (USE_MOCK_DATA) {
      let events = [...mockEvents];

      // Filter by category
      if (params?.category) {
        events = events.filter(e => e.category.slug === params.category);
      }

      // Filter by search
      if (params?.search) {
        const search = params.search.toLowerCase();
        events = events.filter(e =>
          e.title.toLowerCase().includes(search) ||
          e.description.toLowerCase().includes(search)
        );
      }

      return Promise.resolve(events);
    }

    // Real API call
    const response = await axiosClient.get("/events/", { params });
    return response.data;
  },

  // Get single event by ID
  getEvent: async (id: number): Promise<Event> => {
    if (USE_MOCK_DATA) {
      const event = mockEvents.find(e => e.id === id);
      if (!event) throw new Error("Event not found");
      return Promise.resolve(event);
    }

    const response = await axiosClient.get(`/events/${id}/`);
    return response.data;
  },

  // Get trending events
  getTrendingEvents: async (): Promise<Event[]> => {
    if (USE_MOCK_DATA) {
      return Promise.resolve(
        [...mockEvents].sort((a, b) => b.views - a.views).slice(0, 3)
      );
    }

    const response = await axiosClient.get("/events/trending/");
    return response.data;
  },

  // Get nearby events
  getNearbyEvents: async (lat: number, lon: number, radius: number = 10): Promise<Event[]> => {
    if (USE_MOCK_DATA) {
      // Simple mock - return all events
      return Promise.resolve(mockEvents.slice(0, 4));
    }

    const response = await axiosClient.get("/events/nearby/", {
      params: { lat, lon, radius }
    });
    return response.data;
  },

  // Create new event
  createEvent: async (eventData: FormData): Promise<Event> => {
    if (USE_MOCK_DATA) {
      console.log("Mock: Creating event", eventData);
      return Promise.resolve(mockEvents[0]);
    }

    const response = await axiosClient.post("/events/", eventData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  },

  // Update event
  updateEvent: async (id: number, eventData: FormData): Promise<Event> => {
    if (USE_MOCK_DATA) {
      console.log("Mock: Updating event", id, eventData);
      return Promise.resolve(mockEvents[0]);
    }

    const response = await axiosClient.put(`/events/${id}/`, eventData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  },

  // Delete event
  deleteEvent: async (id: number): Promise<void> => {
    if (USE_MOCK_DATA) {
      console.log("Mock: Deleting event", id);
      return Promise.resolve();
    }

    await axiosClient.delete(`/events/${id}/`);
  },

  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    if (USE_MOCK_DATA) {
      return Promise.resolve(mockCategories);
    }

    const response = await axiosClient.get("/categories/");
    return response.data;
  },
};
