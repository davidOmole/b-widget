import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Service {
  _id: string;
  name: string;
  description?: string;
  duration: {
    hour: number;
    min: number;
  };
  location: {
    type: 'online' | 'in_person';
    display_custom_link?: boolean;
    allowed_meeting_platforms?: string[];
    custom_meeting_link?: string;
    address_information?: {
      venue: string;
    };
  };
  feature_image?: {
    path: string;
  };
  booking: string;
  availability_rule_id: string;
  conflict_calendars: Record<string, string[]>;
  staff_selection?: {
    type: string;
    members: Array<{
      invite: {
        first_name: string;
        last_name: string;
        email: string;
      };
      _id: string;
      account: string;
      is_booking_owner: boolean;
      bio: string;
    }>;
  };
  price?: {
    what_you_want: {
      other_prices: any[];
    };
    model: 'FREE' | 'ONE_TIME';
    price?: string;
    discount_price?: string;
    _id: string;
    other_prices: any[];
    other_discount_prices: any[];
    pay_in_tranches: any[];
    fast_action_pricing: any[];
  };
  slot?: {
    start: string;
    end: string;
    timezone: string;
  };
  host_integration?: any;
  host?: string;
  form_info?: any[];
  additional_details?: {
    allow_invitees_add_guests?: boolean;
  };
  account?: {
    _id: string;
    user?: {
      country: string;
    };
  };
  payment_settings?: {
    allow_wallet_payment: boolean;
    allow_card_payment: boolean;
  };
}

interface ServicesResponse {
  limit: number;
  page: number;
  services: Service[];
  total_documents: number;
}

const fetchServices = async (host: string, currency: string): Promise<ServicesResponse> => {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/bookings/services/public?limit=100&page=1&currency=${currency}&host=${host}`
  );
  return response.data;
};

export const useServices = (host: string, currency: string) => {
  return useQuery({
    queryKey: ['services', host, currency],
    queryFn: () => fetchServices(host, currency),
    enabled: !!host && !!currency,
  });
};
