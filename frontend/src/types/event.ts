// Type definitions matching Django models

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
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
  locationName: string;
  latitude: number;
  longitude: number;
  category: Category;
  date: string;
  createdBy: User;
  image: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: number;
  event: number;
  price: number;
  quantity: number;
  available: number;
}
