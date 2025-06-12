export interface Duration {
  hour: number;
  min: number;
}

export interface FeatureImage {
  path: string;
  filename: string;
  content_type: string;
  original_location: string;
}

export interface Location {
  custom_meeting_link: string;
  type: string;
  display_custom_link: boolean;
  allowed_meeting_platforms: string[];
}

export interface Invite {
  first_name: string;
  last_name: string;
  email: string;
}

export interface StaffMember {
  profile_image: any;
  first_name: string;
  name: string;
  invite: Invite;
  _id: string;
  account: string;
  is_booking_owner: boolean;
  bio: string;
}

export interface StaffSelection {
  type: string;
  members: StaffMember[];
}

export interface AdditionalDetails {
  redirect_on_success: boolean;
  redirect_success_url: string;
  allow_invitees_add_guests: boolean;
}

export interface PurchaseEmail {
  body: string;
  subject: string;
  senders_name: string;
  _id: string;
}

export interface WhatYouWant {
  other_prices: any[];
}

export interface Pricing {
  what_you_want: WhatYouWant;
  model: string;
  price: string;
  _id: string;
  other_prices: any[];
  other_discount_prices: any[];
  pay_in_tranches: any[];
  fast_action_pricing: any[];
}

export interface Price {
  discount_price: any;
  currency: string;
  price: string;
}

export interface Service {
  description: any;
  duration: Duration;
  feature_image: FeatureImage;
  location: Location;
  staff_selection: StaffSelection;
  additional_details: AdditionalDetails;
  _id: string;
  name: string;
  status: string;
  created_by: string;
  form_info: any[];
  booking: {
    _id: string;
  };
  current_step_for_draft: string;
  purchase_email: PurchaseEmail;
  pricing: Pricing;
  price: Price;
  host: string;
  host_integration: string;
}

export interface ConferencingProfile {
  provider_name: string;
  profile_id: string;
  profile_name: string;
  profile_connected: boolean;
  status: string;
  _id: string;
}

export interface ElementToken {
  permissions: string[];
  origin: string;
  token: string;
  expires_in: number;
  subs: string[];
}

export interface Token {
  element_token: ElementToken;
}

export interface ServiceResponse {
  customization: any;
  service: Service;
  availability_rule_id: string;
  conferencing_profiles: ConferencingProfile[];
  conflict_calendars: Record<string, string[]>;
  token: Token;
}
