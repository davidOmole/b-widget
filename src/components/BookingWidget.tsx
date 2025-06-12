import { Box, Button, Modal, ModalContent, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface BookingWidgetProps {
  serviceId: string;
  embedType: 'inline' | 'popup' | 'popup_text';
  buttonText?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  children?: ReactNode;
}

export const BookingWidget = ({
  serviceId,
  embedType,
  buttonText = 'Schedule a Meeting',
  onSuccess,
  onError,
  children,
}: BookingWidgetProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSuccess = () => {
    onSuccess?.();
    if (embedType === 'popup' || embedType === 'popup_text') {
      onClose();
    }
  };

  const handleError = (error: Error) => {
    onError?.(error);
  };

  const renderWidget = () => (
    <Box>
      {/* Replace this with your actual booking form component */}
      <Box p={4} border="1px solid" borderColor="gray.200" borderRadius="md">
        <iframe
          src={`/booking/${serviceId}`}
          style={{ width: '100%', height: '600px', border: 'none' }}
          title="Booking Widget"
        />
      </Box>
    </Box>
  );

  if (embedType === 'inline') {
    return renderWidget();
  }

  if (embedType === 'popup_text') {
    return (
      <>
        <Button onClick={onOpen}>{buttonText}</Button>
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>{renderWidget()}</ModalContent>
        </Modal>
      </>
    );
  }

  // Popup embed
  return (
    <>
      {children || <Button onClick={onOpen}>{buttonText}</Button>}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>{renderWidget()}</ModalContent>
      </Modal>
    </>
  );
};
