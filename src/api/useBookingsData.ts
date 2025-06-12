import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface BookingsData {
  is_active: any;
  is_kyc_approved: any;
  _id: string;
  slug: string;
  first_name: string;
  last_name: string;
  email: string;
  display_name: string;
  description: string;
  phone_number: string;
  profile_image: {
    path: string;
  };
  customization: {
    theme_color: string;
    logo: {
      path: string;
    };
  };
  account?: {
    business_country: any;
    _id: string;
    user?: {
      country: string;
    };
  };
  payment_settings?: {
    allow_wallet_payment: boolean;
    allow_card_payment: boolean;
    currency_switcher?: {
      is_enabled: boolean;
      currencies: string[];
    };
  };
  user: string;
}

const fetchBookingsData = async (host: string): Promise<BookingsData> => {
  const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/bookings/public?host=${host}`);
  return response.data;
};

export const useBookingsData = (host: string) => {
  return useQuery({
    queryKey: ['bookingsData', host],
    queryFn: () => fetchBookingsData(host),
    enabled: !!host,
  });
};
