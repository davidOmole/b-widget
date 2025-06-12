import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Service, UserDetails } from '../types';

interface BookingsContextType {
  userDetails: UserDetails | null;
  currency: string;
  setUserDetails: (details: UserDetails | null) => void;
  setCurrency: (currency: string) => void;
  bookingsDetails: {
    service?: Service;
    userDetails?: UserDetails;
    currency?: string;
    allowedConferencingProfiles?: any[];
  };
  setBookingsDetails: (details: any) => void;
}

const BookingsContext = createContext<BookingsContextType | undefined>(undefined);

export const BookingsProvider = ({ children }: { children: ReactNode }) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [currency, setCurrency] = useState('USD');
  const [bookingsDetails, setBookingsDetails] = useState({
    service: undefined,
    userDetails: undefined,
    currency: 'USD',
    allowedConferencingProfiles: [],
  });

  return (
    <BookingsContext.Provider
      value={{
        userDetails,
        currency,
        setUserDetails,
        setCurrency,
        bookingsDetails,
        setBookingsDetails,
      }}
    >
      {children}
    </BookingsContext.Provider>
  );
};

export const useBookingsContext = () => {
  const context = useContext(BookingsContext);
  if (context === undefined) {
    throw new Error('useBookingsContext must be used within a BookingsProvider');
  }
  return context;
};
