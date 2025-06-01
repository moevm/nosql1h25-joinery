
// User types
export interface User {
  id: string;
  fullName: string;
  userType: string;
  login: string;
  isLoggedIn: boolean;
  bio?: string;
  age?: number;
  education?: string;
  rating?: number;
  registrationDate?: string;
  lastUpdate?: string;
  image?: string;
  status?: string;
}

// Listing types
export interface ListingItem {
  id: string;
  title: string;
  masterId: string;
  masterName: string;
  width: number;
  height: number;
  length: number;
  weight: number;
  quantity: number;
  price: number;
  address: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  number?: number;
}

// Comment types
export interface Comment {
  id: string;
  listingId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

// Review types
export interface Review {
  id: string;
  userId: string;
  authorId: string;
  authorName: string;
  text: string;
  rating: number;
  createdAt: string;
}
