import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface ReceiptData {
  payment_reference: string;
  status: string;
  start: string;
  end: string;
  time_zone: string;
  metadata: {
    service_id: {
      _id: string;
      name: string;
      feature_image?: {
        path: string;
        filename: string;
        content_type: string;
        original_location: string;
      };
      additional_details?: {
        redirect_on_success: boolean;
        redirect_success_url: string;
        allow_invitees_add_guests: boolean;
      };
    };
    service_name: string;
    service_price: number;
    integration: string;
    currency: string;
    local_amount: number;
    dollar_amount: number;
    all_attendees: Array<{
      email: string;
      _id: string;
    }>;
    calendar_id: string;
    event_id: string;
  };
  location: {
    type: string;
    address: string;
    meeting_platform: string;
    meeting_platform_id: string;
    display_custom_link: boolean;
  };
  conferencing: {
    status: string;
    provider_name: string;
    join_url: string;
  };
  _id: string;
  booking: string;
  email: string;
  full_name: string;
  staff_selection_type: string;
  host: {
    invite: {
      first_name: string;
      last_name: string;
      email: string;
    };
    _id: string;
    account: {
      _id: string;
      account_name: string;
      is_active: boolean;
    };
    is_booking_owner: boolean;
    bio: string;
  };
  allow_invitees_add_guests: boolean;
  other_guests: any[];
  form_response: any[];
  createdAt: string;
  updatedAt: string;
}

const fetchReceipt = async (reference: string): Promise<ReceiptData> => {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/bookings/appointment/receipt?payment_reference=${reference}`
  );
  return response.data;
};

export const useGetReceipt = (reference: string | undefined) => {
  return useQuery({
    queryKey: ['receipt', reference],
    queryFn: () => fetchReceipt(reference!),
    enabled: !!reference,
  });
};
