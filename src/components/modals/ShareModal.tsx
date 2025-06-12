import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: string;
  service_url?: string;
}

const ShareModal = ({ isOpen, onClose, service, service_url }: ShareModalProps) => {
  const [copied, setCopied] = useState(false);
  const gray500 = useColorModeValue('gray.500', 'gray.400');

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text fontSize="1.25rem" fontWeight={600} lineHeight="30px" letterSpacing="-0.2px">
            Share Service
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb="24px">
          <Box mb="24px">
            <Text fontSize="0.875rem" lineHeight="20px" color={gray500} mb="8px">
              Share this service with others
            </Text>
            <Button variant="outline" size="md" width="100%" onClick={handleCopy}>
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ShareModal;
