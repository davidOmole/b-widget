import { CalendarIcon } from '@chakra-ui/icons';
import { Circle, Flex, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import LayoutWrapper from '../components/LayoutWrapper';
import SessionCard from '../components/SessionCard';
import { useBookingsData, useServices } from '../api';
import { useCurrency } from '../hooks/useCurrency';
import { useBookingState } from '../hooks/useBookingState';

const ServicesPage = () => {
  const params = useParams();
  const userSlug = `${import.meta.env.VITE_BOOKINGS_URL}/${params?.slug}`;
  const fullUrl =
    import.meta.env.VITE_ENV === 'development'
      ? `https://mikun.${import.meta.env.VITE_BOOKINGS_URL}`
      : window.location.hostname;

  console.log('fullUrl', fullUrl);
  const host = params?.slug ? userSlug : fullUrl;
  const { data: bookingsData, isLoading } = useBookingsData(host);
  const { currency } = useCurrency();
  //@ts-ignore
  const { data: servicesData } = useServices(host, currency);
  const { bookingState, setBookingState } = useBookingState();
  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Text>Loading...</Text>
      </Flex>
    );
  }

  return (
    <Flex pt="40px" px="16px" justifyContent="center">
      <Flex flexDirection="column" width={{ base: '100%', md: '720px' }} alignItems="center">
        {bookingsData?.customization?.logo?.path ? (
          <img
            src={bookingsData.customization.logo.path}
            alt={`${bookingsData.display_name} logo`}
            style={{
              width: '130px',
              height: '130px',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Circle size="130px" bgColor="#EFF1F6">
            <CalendarIcon boxSize="48px" color="#56616B" />
          </Circle>
        )}

        <Text
          textAlign="center"
          fontSize={{ base: '1.5rem', lg: '2rem' }}
          fontWeight={700}
          lineHeight="38.4px"
          letterSpacing="-1.28px"
          mt="28px"
          mb="12px"
        >
          {bookingsData?.display_name}
        </Text>
        <Text
          textAlign="center"
          fontSize={{ base: '0.875rem', lg: '1rem' }}
          lineHeight="22.4px"
          mb="24px"
        >
          {bookingsData?.description}
        </Text>
        <Flex flexDirection="column" gap="16px" width="100%" pb="12px">
          {servicesData?.services?.map(service => (
            <SessionCard key={service._id} service={service as any} />
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ServicesPage;
