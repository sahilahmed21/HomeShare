export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
}

export interface Listing {
  id: string;
  userId: string;
  location: string;
  startDate: string;
  endDate: string;
  requirements: string;
  price: number;
  imageUrl: string;
  isBooked: boolean;
}

export interface Booking {
  id: string;
  listingId: string;
  userId: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}