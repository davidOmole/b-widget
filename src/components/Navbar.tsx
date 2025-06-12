import { Flex, Link } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import CurrencyPicker from './CurrencyPicker';
import { useBookingsData } from '../api';
import { useCurrency } from '../hooks/useCurrency';
const Navbar = () => {
  const params = useParams();
  const userSlug = `${import.meta.env.VITE_BOOKINGS_URL}/${params?.slug}`;
  const fullUrl =
    import.meta.env.VITE_ENV === 'development'
      ? `https://mikun.${import.meta.env.VITE_BOOKINGS_URL}`
      : window.location.hostname;

  const host = params?.slug ? userSlug : fullUrl;
  const homeUrl = params?.slug ? `/${params?.slug}` : '/';
  const { data: bookingsData } = useBookingsData(host);
  const { currency } = useCurrency();
  // Set custom color theme
  if (bookingsData?.customization?.theme_color) {
    const root = document.querySelector(':root') as HTMLElement;
    if (root) {
      root.style.setProperty('--booking-custom-color', bookingsData.customization.theme_color);
    }
  }

  return (
    <Flex
      pb="20px"
      justifyContent="space-between"
      alignItems="center"
      position="sticky"
      top={0}
      pt="20px"
      bg="gray.50"
      zIndex="999"
    >
      <Link href={homeUrl}>
        {params?.id ? (
          <img
            src={bookingsData?.customization?.logo?.path}
            alt="Logo"
            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
          />
        ) : (
          <img
            src="/bookingsLogo.svg"
            alt="Bookings Logo"
            style={{ width: '40px', height: '40px' }}
          />
        )}
      </Link>
      <Flex gap="12px">
        {bookingsData?.payment_settings?.currency_switcher?.is_enabled &&
          !window.location.pathname.includes('reschedule') && (
            <CurrencyPicker
              usersCurrencies={bookingsData?.payment_settings?.currency_switcher?.currencies}
              currentCurrency={currency || 'USD'}
              setCurrency={(newCurrency: string) => {
                // Update currency in localStorage
                const ipData = JSON.parse(localStorage.getItem('userIp') || '{}');
                localStorage.setItem(
                  'userIp',
                  JSON.stringify({ ...ipData, currency: newCurrency })
                );
              }}
            />
          )}
        <Link
          href={`${import.meta.env.VITE_MAIN_APP_URL}/bookings/signup`}
          target="_blank"
          style={{ textDecoration: 'none' }}
        >
          <button
            style={{
              padding: '8px 16px',
              backgroundColor: '#F1F1F1',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Sell your services
          </button>
        </Link>
      </Flex>
    </Flex>
  );
};

export default Navbar;
