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

interface ReportPageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReportPageModal = ({ isOpen, onClose }: ReportPageModalProps) => {
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
            Report Service
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb="24px">
          <Box mb="24px">
            <Text fontSize="0.875rem" lineHeight="20px" color={Colors.gray500} mb="8px">
              Report this service if you believe it violates our terms of service
            </Text>
            <Button
              variant="outline"
              size="medium"
              width="100%"
              onClick={handleSubmit}
              isDisabled={submitted}
            >
              {submitted ? 'Reported!' : 'Report Service'}
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ReportPageModal;
