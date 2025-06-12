import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface GetSingleServiceParams {
  service_id: string;
  host: string;
  origin: string;
  currency: string;
}

interface ServiceResponse {
  service: {
    _id: string;
    name: string;
    price?: {
      price: number;
      discount_price?: number;
      currency: string;
    };
    slot?: {
      start: string;
      end: string;
      timezone: string;
    };
    location?: {
      type: string;
      allowed_meeting_platforms?: string[];
      custom_meeting_link?: string;
      display_custom_link?: boolean;
    };
    duration?: {
      hour: number;
      min: number;
    };
    host_integration?: any;
    host?: string;
    booking?: string;
    form_info?: any[];
    additional_details?: {
      allow_invitees_add_guests?: boolean;
    };
    feature_image?: any;
    staff_selection?: any;
  };
  userDetails: {
    user: string;
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
  };
  conferencing_profiles?: any[];
}

const fetchSingleService = async (params: GetSingleServiceParams): Promise<ServiceResponse> => {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/bookings/services/${params.service_id}/public`,
    {
      params: {
        host: params.host,
        origin: params.origin,
        currency: params.currency,
      },
    }
  );
  return response.data;
};

export const useGetSingleService = (params: GetSingleServiceParams) => {
  return useQuery({
    queryKey: ['singleService', params.service_id],
    queryFn: () => fetchSingleService(params),
    enabled: !!params.service_id,
  });
};
