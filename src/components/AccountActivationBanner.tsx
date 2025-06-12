import { Box, Flex, Text } from '@chakra-ui/react';
import { Button, Colors } from 'mainstack-design-system';

interface AccountActivationBannerProps {
  onContactMerchant: () => void;
}

const AccountActivationBanner = ({ onContactMerchant }: AccountActivationBannerProps) => {
  return (
    <Box bgColor={Colors.blue50} p="16px" borderRadius="8px" mb="24px">
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontSize="0.875rem" lineHeight="20px" color={Colors.blue500}>
          Your account needs to be activated before you can book services
        </Text>
        <Button variant="outline" size="small" onClick={onContactMerchant}>
          Contact Merchant
        </Button>
      </Flex>
    </Box>
  );
};

export default AccountActivationBanner;
