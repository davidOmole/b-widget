interface BookingWidgetOptions {
  type: 'inline' | 'popup' | 'popup_text';
  target: HTMLElement;
  serviceId: string;
  slug: string;
  buttonText?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

declare function initBookingWidget(options: BookingWidgetOptions): void;

export default initBookingWidget;
