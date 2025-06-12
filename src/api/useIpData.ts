import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface IpData {
  currency: string;
  country: string;
  // Add other IP data fields as needed
}

const fetchIpData = async (): Promise<IpData> => {
  const response = await axios.get(`https://ipapi.co/json?key=${import.meta.env.VITE_IPAPI_KEY}`);
  return response.data;
};

export const useIpData = () => {
  return useQuery({
    queryKey: ['ipData'],
    queryFn: fetchIpData,
    staleTime: Infinity, // IP data doesn't change often
  });
};
