// Type definitions matching Django models

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  location_name: string;
  latitude: number;
  longitude: number;
  category: Category;
  date: string;
  created_by: User;
  image: string;
  views: number;
  created_at: string;
  is_attending?: boolean;
  attendee_count?: number;
}

export interface Ticket {
  id: number;
  event: number;
  price: number;
  quantity: number;
  available: number;
}
