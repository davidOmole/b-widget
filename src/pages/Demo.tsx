import { Box, Button, Flex, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { BookingWidget } from '../components/BookingWidget';

const Demo = () => {
  const [showInline, setShowInline] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  return (
    <Box p={8}>
      <VStack spacing={8} align="stretch">
        <Text fontSize="2xl" fontWeight="bold">
          Booking Widget Demo
        </Text>

        {/* Inline Embed */}
        <Box>
          <Text fontSize="lg" fontWeight="semibold" mb={4}>
            Inline Embed
          </Text>
          <Button onClick={() => setShowInline(!showInline)} mb={4}>
            {showInline ? 'Hide Inline Widget' : 'Show Inline Widget'}
          </Button>
          {showInline && (
            <Box border="1px solid" borderColor="gray.200" borderRadius="md" p={4}>
              <BookingWidget
                serviceId="your-service-id"
                embedType="inline"
                onSuccess={() => console.log('Booking successful')}
                onError={error => console.error('Booking failed:', error)}
              />
            </Box>
          )}
        </Box>

        {/* Popup Embed */}
        <Box>
          <Text fontSize="lg" fontWeight="semibold" mb={4}>
            Popup Embed
          </Text>
          <Button onClick={() => setShowPopup(!showPopup)} mb={4}>
            {showPopup ? 'Hide Popup Widget' : 'Show Popup Widget'}
          </Button>
          {showPopup && (
            <BookingWidget
              serviceId="your-service-id"
              embedType="popup"
              onSuccess={() => console.log('Booking successful')}
              onError={error => console.error('Booking failed:', error)}
            />
          )}
        </Box>

        {/* Popup Text Embed */}
        <Box>
          <Text fontSize="lg" fontWeight="semibold" mb={4}>
            Popup Text Embed
          </Text>
          <BookingWidget
            serviceId="your-service-id"
            embedType="popup_text"
            buttonText="Schedule a Meeting"
            onSuccess={() => console.log('Booking successful')}
            onError={error => console.error('Booking failed:', error)}
          />
        </Box>
      </VStack>
    </Box>
  );
};

export default Demo;
