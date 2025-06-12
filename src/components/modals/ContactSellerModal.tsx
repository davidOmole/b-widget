import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { Button, Colors } from 'mainstack-design-system';
import { useState } from 'react';

interface SellerDetails {
  name?: string;
  email?: string;
}

interface ContactSellerModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellerDetails?: SellerDetails;
}

const ContactSellerModal = ({ isOpen, onClose, sellerDetails }: ContactSellerModalProps) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text fontSize="1.25rem" fontWeight={600} lineHeight="30px" letterSpacing="-0.2px">
            Contact Seller
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb="24px">
          <Box mb="24px">
            <Text fontSize="0.875rem" lineHeight="20px" color={Colors.gray500} mb="8px">
              Contact {sellerDetails?.name || 'the seller'} for more information
            </Text>
            <Button
              variant="outline"
              size="medium"
              width="100%"
              onClick={handleSubmit}
              isDisabled={submitted}
              label={submitted ? 'Message Sent!' : 'Send Message'}
            />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ContactSellerModal;
