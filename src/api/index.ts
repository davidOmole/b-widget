import { useMutation, useQuery } from '@tanstack/react-query';
import { Request } from './config';
import { ServiceResponse } from './types';

interface IGetSingleService {
  service_id: string;
  host: string;
  currency: string;
  member_id?: string;
  onSuccess?: (res: ServiceResponse) => void;
  initialData?: ServiceResponse;
  origin: string;
}

export const useGetSingleService = ({
  service_id,
  host,
  origin,
  currency,
  member_id,
  onSuccess,
  initialData,
}: IGetSingleService) =>
  useQuery<ServiceResponse>({
    queryFn: async () => {
      try {
        const queryParams = new URLSearchParams({
          host,
          origin,
          currency,
        });

        if (member_id) {
          queryParams.append('member_id', member_id);
        }

        const url = `bookings/services/public/${service_id}?${queryParams.toString()}`;
        let res = await Request.get(url);
        onSuccess && onSuccess(res.data);
        return res.data;
      } catch (error: any) {
        throw error?.response?.data;
      }
    },
    queryKey: ['getSingleService', service_id, host, origin, currency, member_id],
    enabled: !!service_id && !!host && !!origin,
    initialData,
    gcTime: 30 * 60 * 1000, // Cache is kept for 30 minutes (replaces cacheTime)
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch when component mounts
    refetchOnReconnect: false, // Don't refetch when reconnecting
  });

interface IBookAppointment {
  payment_reference: string;
  metadata: {
    service_id: string;
    service_name: string;
    service_price: number;
  };
  host?: string;
  start: string;
  end: string;
  time_zone: string;
  other_guests?: string[];
  form_response: any[];
  full_name: string;
  email: string;
  host_integration: string;
  conferencing_profile_id: string;
}

export const useBookAppointment = () =>
  useMutation({
    mutationFn: async (data: IBookAppointment) => {
      try {
        let res = await Request.post('/bookings/appointment/schedule', data);
        return res.data;
      } catch (error: any) {
        throw error?.response?.data;
      }
    },
  });

export const useBookFreeAppointment = () =>
  useMutation({
    mutationFn: async (data: IBookAppointment) => {
      try {
        let res = await Request.post('/bookings/appointment/schedule_free', data);
        return res.data;
      } catch (error: any) {
        throw error?.response?.data;
      }
    },
  });

interface IGetSingleAppointment {
  payment_reference: string;
  host: string;
}

export const useGetSingleAppointment = ({ payment_reference, host }: IGetSingleAppointment) =>
  useQuery({
    queryFn: async () => {
      try {
        let res = await Request.get(
          `${host}/bookings/appointment/re_schedule?payment_reference=${payment_reference}`
        );
        return res.data;
      } catch (error: any) {
        throw error?.response?.data;
      }
    },
    queryKey: ['getSingleAppointment', payment_reference, host],
    enabled: !!payment_reference && !!host,
  });

interface IRescheduleAppointment {
  payment_reference: string;
  start: string;
  end: string;
  time_zone: string;
}

export const useRescheduleAppointment = () =>
  useMutation({
    mutationFn: async (data: IRescheduleAppointment) => {
      try {
        let res = await Request.patch('/bookings/appointment/re_schedule', data);
        return res.data;
      } catch (error: any) {
        throw error?.response?.data;
      }
    },
  });

interface IGetTeamMemberSchedule {
  service_id: string;
  team_member_id: string;
  host: string;
}

export const useGetTeamMemberSchedule = ({
  service_id,
  team_member_id,
  host,
}: IGetTeamMemberSchedule) =>
  useQuery({
    queryFn: async () => {
      try {
        let res = await Request.get(
          `${host}/bookings/services/public/${service_id}/${team_member_id}`
        );
        return res.data;
      } catch (error: any) {
        throw error?.response?.data;
      }
    },
    queryKey: ['getTeamMemberSchedule', service_id, team_member_id, host],
    enabled: !!service_id && !!team_member_id && !!host,
  });

export * from './useGetSingleService';
export * from './useIpData';
export * from './useBookingsData';
export * from './useServices';
