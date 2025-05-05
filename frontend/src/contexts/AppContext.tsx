import React, { createContext, useState, ReactNode } from 'react';
import { AppContextType } from './AppContextType';
import { User, ListingItem, Comment, Review } from '@/types';
import { sampleListings, sampleComments, sampleUsers, sampleReviews } from '@/data/sampleData';

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<ListingItem[]>(sampleListings);
  const [comments, setComments] = useState<Comment[]>(sampleComments);
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [reviews, setReviews] = useState<Review[]>(sampleReviews);

  const login = (login: string, password: string) => {
    // Имитация аутентификации
    if (login && password) {
      const foundUser = users.find(u => u.login === login);
      if (foundUser) {
        setUser({...foundUser, isLoggedIn: true});
      } else {
        setUser({
          id: '1',
          fullName: 'Гаранин Роман Андреевич',
          userType: 'Мастер',
          login: login,
          isLoggedIn: true,
        });
      }
    }
  };

  const logout = () => {
    setUser(null);
  };

  const register = (fullName: string, userType: string, login: string, password: string) => {
    // Имитация регистрации
    if (fullName && userType && login && password) {
      const newUser = {
        id: Date.now().toString(),
        fullName,
        userType,
        login,
        isLoggedIn: true,
        registrationDate: new Date().toISOString().split('T')[0],
        lastUpdate: new Date().toISOString().split('T')[0],
        rating: 0,
      };
      setUsers([...users, newUser]);
      setUser(newUser);
    }
  };

  const createListing = (listing: Omit<ListingItem, 'id' | 'masterId' | 'masterName' | 'createdAt' | 'updatedAt'>) => {
    if (user) {
      const newListing: ListingItem = {
        ...listing,
        id: Date.now().toString(),
        masterId: user.id,
        masterName: user.fullName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setListings([...listings, newListing]);
    }
  };

  const updateListing = (id: string, updates: Partial<ListingItem>) => {
    setListings(
      listings.map((listing) =>
        listing.id === id
          ? { ...listing, ...updates, updatedAt: new Date().toISOString() }
          : listing
      )
    );
  };

  const deleteListing = (id: string) => {
    setListings(listings.filter((listing) => listing.id !== id));
  };

  const addComment = (listingId: string, text: string) => {
    if (user) {
      const newComment: Comment = {
        id: Date.now().toString(),
        listingId,
        userId: user.id,
        userName: user.fullName,
        text,
        createdAt: new Date().toISOString(),
      };
      setComments([...comments, newComment]);
    }
  };

  const addReview = (userId: string, text: string, rating: number) => {
    if (user) {
      const newReview: Review = {
        id: Date.now().toString(),
        userId,
        authorId: user.id,
        authorName: user.fullName,
        text,
        rating,
        createdAt: new Date().toISOString(),
      };
      setReviews([...reviews, newReview]);
    }
  };

  const getUserById = (id: string) => {
    return users.find(u => u.id === id);
  };

  const getUserReviews = (userId: string) => {
    return reviews.filter(review => review.userId === userId);
  };

  const getUserListings = (userId: string) => {
    return listings.filter(listing => listing.masterId === userId);
  };

  // Create context value
  const value = {
    user,
    listings,
    comments,
    users,
    reviews,
    login,
    logout,
    register,
    createListing,
    updateListing,
    deleteListing,
    addComment,
    addReview,
    getUserById,
    getUserReviews,
    getUserListings,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
