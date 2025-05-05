import { User, ListingItem, Comment, Review } from '@/types';

export interface AppContextType {
  user: User | null;
  listings: ListingItem[];
  comments: Comment[];
  users: User[];
  reviews: Review[];
  login: (login: string, password: string) => void;
  logout: () => void;
  register: (fullName: string, userType: string, login: string, password: string) => void;
  createListing: (listing: Omit<ListingItem, 'id' | 'masterId' | 'masterName' | 'createdAt' | 'updatedAt'>) => void;
  updateListing: (id: string, updates: Partial<ListingItem>) => void;
  deleteListing: (id: string) => void;
  addComment: (listingId: string, text: string) => void;
  addReview: (userId: string, text: string, rating: number) => void;
  getUserById: (id: string) => User | undefined;
  getUserReviews: (userId: string) => Review[];
  getUserListings: (userId: string) => ListingItem[];
}
