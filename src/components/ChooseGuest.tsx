import { Box, Flex, Text } from '@chakra-ui/react';
import { Button, Colors } from 'mainstack-design-system';
import { useState } from 'react';
import { StaffMember } from '../api/types';

interface Member {
  _id: string;
  name: string;
  avatar?: string;
}

interface ChooseGuestProps {
  members: StaffMember[];
  onSelectMember: (id: string) => void;
  toggleIsBookingOwner: (is_booking_owner: boolean) => void;
}

const ChooseGuest = ({ members, onSelectMember, toggleIsBookingOwner }: ChooseGuestProps) => {
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectMember = async (memberId: string) => {
    setIsLoading(true);
    setSelectedMember(memberId);
    await onSelectMember(memberId);
    setIsLoading(false);
  };

  return (
    <Box border="1px solid" borderColor={Colors.gray50} p="24px" borderRadius="16px">
      <Text fontSize="1.25rem" fontWeight={600} lineHeight="30px" letterSpacing="-0.2px" mb="24px">
        Choose a Team Member
      </Text>
      <Flex direction="column" gap="16px">
        {members.map(member => (
          <Button
            key={member._id}
            variant="outline"
            size="large"
            width="100%"
            justifyContent="flex-start"
            onClick={() => handleSelectMember(member._id)}
            isDisabled={isLoading}
            leftIcon={
              member.profile_image ? (
                <img
                  src={member.profile_image}
                  alt={member.first_name}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <Box width="32px" height="32px" borderRadius="50%" bgColor={Colors.gray50} />
              )
            }
          >
            {member.name}
          </Button>
        ))}
      </Flex>
    </Box>
  );
};

export default ChooseGuest;
