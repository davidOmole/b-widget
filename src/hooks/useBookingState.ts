import { useQuery, useQueryClient } from '@tanstack/react-query';

interface Slot {
  start: string;
  end: string;
  timezone: string;
}

interface ConferencingProfile {
  _id: string;
  name: string;
  type: string;
  platform: string;
  settings: {
    [key: string]: any;
  };
}

interface BookingState {
  slot?: Slot;
  host?: string;
  allowedConferencingProfiles?: ConferencingProfile[];
}

export const useBookingState = () => {
  const queryClient = useQueryClient();

  const { data: bookingState } = useQuery({
    queryKey: ['bookingState'],
    queryFn: () => ({}) as BookingState,
    staleTime: Infinity,
    gcTime: 30 * 60 * 1000, // Cache is kept for 30 minutes (replaces cacheTime)
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch when component mounts
    refetchOnReconnect: false,
  });

  const setBookingState = (newState: Partial<BookingState>) => {
    console.log('newState', newState);
    queryClient.setQueryData(['bookingState'], (oldState: BookingState = {}) => ({
      ...oldState,
      ...newState,
    }),
  
  );
  };

  return {
    bookingState,
    setBookingState,
  };
};
