import { ReactNode } from 'react';

export interface BookingWidgetOptions {
  type: 'inline' | 'popup' | 'popup_text';
  targetId: string;
  serviceId: string;
  slug: string;
  buttonText?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export interface BookingWidgetProps {
  serviceId: string;
  embedType: 'inline' | 'popup' | 'popup_text';
  buttonText?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  children?: ReactNode;
}

export interface StandaloneWidgetOptions {
  type: 'inline' | 'popup';
  target: HTMLElement;
  serviceId: string;
  slug: string;
}

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

export interface BookingWidgetState {
  userDetails: UserDetails | null;
  service: Service | null;
  loading: boolean;
  error: string | null;
}

export interface BookingWidgetContextType extends BookingWidgetState {
  refreshData: () => Promise<void>;
}

declare global {
  interface Window {
    initBookingWidget: (options: BookingWidgetOptions) => void;
  }
}

export function BookingWidget(props: BookingWidgetProps): JSX.Element;
export function initBookingWidget(options: BookingWidgetOptions): void; 