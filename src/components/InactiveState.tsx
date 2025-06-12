import { Box, Circle, Flex, Image, Img, Text } from '@chakra-ui/react';
import { CalendarMonthIcon, EnterpriseIcon } from 'mainstack-design-system';
import turnedOffStateImage from '../assets/turned-off-state.png';
import { getSocialMediaLink, Socials, urlSocialMedia } from '../utils/socialUtils';
interface InactiveStateProps {
  displayName: string;
  description?: string;
  logo?: {
    path: string;
  };
  type: 'booking' | 'service';
  serviceDetails?: {
    price?: {
      price: number;
      currency: string;
      discount_price?: number;
    };
    duration?: {
      hour: number;
      min: number;
    };
    location?: {
      type: string;
      allowed_meeting_platforms?: string[];
    };
    feature_image?: {
      path: string;
    };
  };
  socialLinks?: Array<{
    platform: string;
    username: string;
  }>;
  themeColor?: string;
  onSocialLinkClick?: (link: string) => void;
}

const InactiveState = ({
  displayName,
  description,
  logo,
  type,
  serviceDetails,
  socialLinks,
  themeColor,
  onSocialLinkClick,
}: InactiveStateProps) => {
  if (type === 'booking') {
    return (
      <Flex
        flexDirection={'column'}
        width={{ base: '100%', md: '720px' }}
        alignItems={'center'}
        pt={'64px'}
      >
        {logo?.path ? (
          <Image
            src={logo.path}
            alt={`${displayName} logo`}
            width={{ base: '90px', lg: '130px' }}
            height={{ base: '90px', lg: '130px' }}
            borderRadius={'50%'}
            objectFit="cover"
          />
        ) : (
          <Circle size={'130px'} bgColor={'#EFF1F6'}>
            <CalendarMonthIcon boxSize={'48px'} color={'#56616B'} />
          </Circle>
        )}

        <Text
          textAlign={'center'}
          fontSize={{ base: '1.5rem', lg: '2rem' }}
          fontWeight={700}
          lineHeight={'38.4px'}
          letterSpacing={'-1.28px'}
          mt={'28px'}
          mb={'12px'}
        >
          {displayName}
        </Text>
        {description && (
          <Text
            textAlign={'center'}
            fontSize={{ base: '0.875rem', lg: '1rem' }}
            lineHeight={'22.4px'}
            mb={'24px'}
          >
            {description}
          </Text>
        )}

        <Flex gap={'12px'} mb={'64px'} justify={{ base: 'left', md: 'unset' }} flexWrap="wrap">
          {socialLinks?.map(
            (socialMedia, index) =>
              socialMedia?.platform && (
                <Circle
                  size={'36px'}
                  bg={themeColor || '#131316'}
                  key={index}
                  as={'a'}
                  href={
                    socialMedia.platform === 'mainstack'
                      ? `https://mainstack.me/${socialMedia?.username}`
                      : `${
                          urlSocialMedia.includes(socialMedia.platform?.toLowerCase())
                            ? socialMedia?.username
                            : `${getSocialMediaLink(socialMedia.platform)}${socialMedia.username}`
                        }`
                  }
                  target="_blank"
                  onClick={() =>
                    onSocialLinkClick?.(
                      `${getSocialMediaLink(socialMedia.platform)}${socialMedia.username}`
                    )
                  }
                  dangerouslySetInnerHTML={{
                    __html: Socials[socialMedia?.platform?.toLowerCase()]?.svg,
                  }}
                />
              )
          )}
        </Flex>

        <Box textAlign={'center'} mt={'24px'}>
          <Img
            src={turnedOffStateImage}
            alt={`bookings turned off`}
            w={'78px'}
            h={'54px'}
            mx={'auto'}
          />

          <Text
            fontSize={'18px'}
            fontWeight={700}
            lineHeight={'20px'}
            letterSpacing={'-0.18px'}
            mb={'8px'}
          >
            {displayName} is currently unavailable
          </Text>

          <Text fontSize={'16px'} fontWeight={400} lineHeight={'22px'}>
            Just stepping away for a bit. Be back soon
          </Text>
        </Box>
      </Flex>
    );
  }

  return (
    <Box maxWidth={'1800px'} mx={'auto'} pt={'64px'}>
      <Box textAlign={'center'}>
        <Img
          src={turnedOffStateImage}
          alt={`bookings turned off`}
          w={'78px'}
          h={'54px'}
          mx={'auto'}
          mb={'24px'}
        />

        <Text
          fontSize={'18px'}
          fontWeight={700}
          lineHeight={'20px'}
          letterSpacing={'-0.18px'}
          mb={'8px'}
        >
          {displayName} is currently unavailable
        </Text>

        <Text fontSize={'16px'} fontWeight={400} lineHeight={'22px'}>
          Just stepping away for a bit. Be back soon
        </Text>
      </Box>
    </Box>
  );
};

export default InactiveState;
