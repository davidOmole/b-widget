import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useCurrency = () => {
  const queryClient = useQueryClient();

  const { data: currency } = useQuery({
    queryKey: ['currency'],
    queryFn: () => 'USD', // Default currency
    staleTime: Infinity, // Currency doesn't change often
  });

  const setCurrency = (newCurrency: string) => {
    queryClient.setQueryData(['currency'], newCurrency);
  };

  return { currency, setCurrency };
};
