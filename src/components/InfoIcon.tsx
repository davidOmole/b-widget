import { InfoIcon as ChakraInfoIcon } from '@chakra-ui/icons';
import { IconProps } from '@chakra-ui/react';

interface InfoIconProps extends IconProps {
  color?: string;
}

export const InfoIcon = ({ color = 'gray.500', ...props }: InfoIconProps) => {
  return <ChakraInfoIcon color={color} {...props} />;
};
