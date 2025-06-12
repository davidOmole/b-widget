import { Box, Flex, Img } from '@chakra-ui/react';
import { VideoCamIcon } from 'mainstack-design-system';

export const CustomMeetingPlatformOptionLabel = (option: { label: string; img: string }) => {
  return (
    <Flex className="country-option" display="flex" alignItems="center" w={'100%'}>
      {option.img ? (
        <Img src={option.img} alt="platform-image" boxSize="20px" marginRight="8px" />
      ) : (
        <Flex alignItems={'center'} h={'28px'} w={'28px'} justifyContent={'center'} mr={'6px'}>
          {' '}
          <VideoCamIcon boxSize={'24px'} />{' '}
        </Flex>
      )}

      <Box>{option.label}</Box>
    </Flex>
  );
};
