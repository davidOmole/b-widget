import { ArrowForwardIcon, TimeIcon, ViewIcon } from '@chakra-ui/icons';
import { Box, Center, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { Link, useParams } from 'react-router-dom';
import { useBookingsData } from '../api';
import { Service } from '../types';

interface SessionCardProps {
  service: Service;
}

const SessionCard = ({ service }: SessionCardProps) => {
  const gray50 = useColorModeValue('gray.50', 'gray.700');
  const gray500 = useColorModeValue('gray.500', 'gray.400');
  const gray900 = useColorModeValue('gray.900', 'white');
  const params = useParams();
  const userSlug = `${import.meta.env.VITE_BOOKINGS_URL}/${params?.slug}`;
  const fullUrl =
    import.meta.env.VITE_ENV === 'development'
      ? `https://mikun.${import.meta.env.VITE_BOOKINGS_URL}`
      : window.location.hostname;

  const host = params?.slug ? userSlug : fullUrl;
  const homeUrl = params?.slug ? `/${params?.slug}` : '/';
  const { data: bookingsData } = useBookingsData(host);
  const getPriceInfo = () => {
    return {
      price: service.price.price.toString(),
      currency: service.price.currency,
      discount_price: service.price.discount_price,
    };
  };

  const getDurationDisplay = () => {
    const { hour, min } = service.duration;
    if (hour === 0) return `${min} min`;
    if (min === 0) return `${hour} hr`;
    return `${hour} hr ${min} min`;
  };

  const getLocationType = () => {
    return service.location.type === 'online' ? 'Online' : 'In Person';
  };

  const getPlatformIcon = (platform: string): string => {
    switch (platform.toLowerCase()) {
      case 'zoom':
        return 'https://cdn-icons-png.flaticon.com/512/5969/5969059.png';
      case 'google meet':
        return 'https://cdn-icons-png.flaticon.com/512/5969/5969094.png';
      case 'microsoft teams':
        return 'https://cdn-icons-png.flaticon.com/512/5969/5969020.png';
      default:
        return 'https://cdn-icons-png.flaticon.com/512/5969/5969020.png';
    }
  };

  const priceInfo = getPriceInfo();

  console.log('bookingsData', bookingsData);
  return (
    <Link to={`/${bookingsData?.slug}/${service._id}`} style={{ textDecoration: 'none' }}>
      <Flex
        border={`1px solid ${gray50}`}
        p="16px"
        borderRadius="16px"
        w="100%"
        _hover={{
          bgColor: gray50,
          transition: 'all 0.3s ease-in',
        }}
        justifyContent="space-between"
        data-group
      >
        <Flex gap="12px">
          {service.feature_image ? (
            <Box
              width={{ base: '48px', lg: '80px' }}
              height={{ base: '48px', lg: '60px' }}
              borderRadius="8px"
              overflow="hidden"
            >
              <img
                src={service.feature_image.path}
                alt="Service Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
            </Box>
          ) : (
            <Center
              width={{ base: '48px', lg: '80px' }}
              height={{ base: '48px', lg: '60px' }}
              borderRadius="8px"
              bgColor={gray50}
            >
              <ViewIcon boxSize="20px" color={gray500} />
            </Center>
          )}
          <Box>
            <Text
              fontSize={{ base: '0.875rem', lg: '1rem' }}
              fontWeight={600}
              lineHeight="22px"
              color={gray900}
            >
              {service.name}
            </Text>
            <Flex gap="8px" mt="4px">
              <Flex align="center" gap="4px">
                <TimeIcon boxSize="14px" color={gray500} />
                <Text fontSize="0.75rem" color={gray500}>
                  {getDurationDisplay()}
                </Text>
              </Flex>
              <Text fontSize="0.75rem" color={gray500}>
                •
              </Text>
              <Text fontSize="0.75rem" color={gray500}>
                {getLocationType()}
              </Text>
            </Flex>
          </Box>
        </Flex>
        <Flex align="center" gap="8px">
          <Text fontSize="0.875rem" fontWeight={600} color={gray900}>
            {priceInfo.currency} {priceInfo.price}
          </Text>
          <ArrowForwardIcon boxSize="16px" color={gray500} />
        </Flex>
      </Flex>
    </Link>
  );
};

export default SessionCard;
