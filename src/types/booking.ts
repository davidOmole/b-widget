import { Service } from './service';

export interface BookingDetails {
  service: Service;
  selectedSlot: {
    start: string;
    end: string;
  };
}
