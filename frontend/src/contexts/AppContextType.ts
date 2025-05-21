
import { User, ListingItem, Comment, Review } from '@/types';

export interface AppContextType {
  user: User | null;
  listings: ListingItem[];
  comments: Comment[];
  users: User[];
  reviews: Review[];
  loading: boolean;
  login: (login: string, password: string) => void;
  logout: () => void;
  register: (
    fullName: string, 
    userType: string, 
    login: string, 
    password: string, 
    age?: number,
    education?: string,
    description?: string,
    image?: string
  ) => void;
  createListing: (listing: Omit<ListingItem, 'id' | 'masterId' | 'masterName' | 'createdAt' | 'updatedAt'>) => void;
  updateListing: (id: string, updates: Partial<ListingItem>) => void;
  deleteListing: (id: string) => void;
  addComment: (listingId: string, text: string) => void;
  addReview: (userId: string, text: string, rating: number) => void;
  getUserById: (id: string) => Promise<User | undefined>;
  getUserReviews: (userId: string) => Promise<Review[]>;
  getUserListings: (userId: string) => ListingItem[];
  fetchListings: (filters?: any) => void;
  updateUserProfile: (updates: {
    fullName?: string;
    bio?: string;
    age?: number;
    education?: string;
    image?: string;
  }) => Promise<void>;
}
