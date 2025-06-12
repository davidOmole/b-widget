import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CustomSnackbarContainer } from 'mainstack-design-system';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { BookingsProvider } from './context/BookingsContext';
import { CheckoutPage } from './pages/CheckoutPage';
import ServiceDetailsPage from './pages/ServiceDetailsPage';
import ServicesPage from './pages/ServicesPage';
import ReceiptPage from './pages/Receipt';
import { useEffect } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

interface AppProps {
  initialPath?: string;
}

function AppRoutes({ initialPath }: AppProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (initialPath) {
      console.log('Navigating to initial path:', initialPath);
      navigate(initialPath);
    }
  }, [initialPath, navigate]);

  return (
    <>
      <CustomSnackbarContainer />
      <Routes>
        <Route path="/:slug/:id" element={<ServiceDetailsPage />} />
        <Route path="/:slug" element={<ServicesPage />} />
        <Route path="/receipt/:receiptId" element={<ReceiptPage />} />
        <Route path=":slug/:id/checkout" element={<CheckoutPage />} />
        <Route path="/" element={<ServicesPage />} />
      </Routes>
    </>
  );
}

function App({ initialPath }: AppProps) {
  return (  
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <BookingsProvider>
          <BrowserRouter>
            <AppRoutes initialPath={initialPath} />
          </BrowserRouter>
        </BookingsProvider>
      </ChakraProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
