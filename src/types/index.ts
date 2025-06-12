export interface UserDetails {
  display_name: string;
  description: string;
  customization: {
    logo?: {
      path: string;
    };
    theme_color: string;
  };
  slug: string;
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
}

export interface Service {
  currency: string;
  _id: string;
  name: string;
  description: string;
  duration: {
    hour: number;
    min: number;
  };
  price: {
    price: number;
    currency: string;
    discount_price?: number;
  };
  location: {
    type: string;
    allowed_meeting_platforms?: string[];
    custom_meeting_link?: string;
    display_custom_link?: boolean;
  };
  booking: string;
  feature_image?: {
    path: string;
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
    redirect_on_success?: boolean;
    redirect_success_url?: string;
  };
  staff_selection?: any;
}
