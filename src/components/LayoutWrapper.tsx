import { Box, Flex } from '@chakra-ui/react';
import Navbar from './Navbar';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  return (
    <Box px="12px" pb="10px" bg="gray.50">
      <Navbar />
      <Box bg="white" minHeight="calc(100dvh - 100px)" borderRadius="18px">
        {children}
      </Box>
    </Box>
  );
};

export default LayoutWrapper;
