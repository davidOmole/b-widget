export interface Service {
  _id: string;
  id: string;
  name: string;
  description?: string;
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
  origin: string;
  currency: string;
  member_id: string;
  token: string;
  availability_rule_id: string;
  conflict_calendars: string[];
  conferencing_profiles: string[];
}
