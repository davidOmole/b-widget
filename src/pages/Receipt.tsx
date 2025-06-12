import { Box, Center, Divider, Flex, Text } from '@chakra-ui/react';
import { EmailIcon, InfoIcon } from '@chakra-ui/icons';
import { Button, Loader, Colors } from 'mainstack-design-system';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DateTime } from 'luxon';
import { formatDuration } from '../utils/formatDuration';
import { useGetReceipt } from '../api/payment';

const Receipt = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [countdown, setCountdown] = useState<number>(5);

  console.log('got here:::>', params);

  const { data: receiptData, isLoading, isError } = useGetReceipt(params?.receiptId as string);

  console.log('receiptData', receiptData);
  const dateTime = receiptData?.start ? DateTime.fromISO(receiptData.start) : null;
  const hasRedirect = sessionStorage.getItem('with_redirect');
  const isDeclined = receiptData?.status === 'declined';

  useEffect(() => {
    if (hasRedirect && receiptData?.metadata?.service_id?.additional_details?.redirect_on_success) {
      const timer = setInterval(() => {
        setCountdown(prevCountdown => {
          if (prevCountdown <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);

      return () => {
        clearInterval(timer);
        sessionStorage.removeItem('with_redirect');
      };
    }
  }, [hasRedirect, receiptData?.metadata?.service_id?.additional_details?.redirect_on_success]);

  // Redirect effect
  useEffect(() => {
    if (countdown === 0 && hasRedirect) {
      const redirectUrl =
        receiptData?.metadata?.service_id?.additional_details?.redirect_success_url;
      if (redirectUrl) {
        const formattedUrl = redirectUrl.startsWith('http')
          ? redirectUrl
          : `https://${redirectUrl}`;
        window.location.href = formattedUrl;
      }
    }
  }, [countdown, hasRedirect, receiptData]);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    // navigate("/");
    return null;
  }

  return (
    <Flex pt={'40px'} justifyContent={'center'}>
      <Flex
        flexDirection={'column'}
        width={{ base: '100%', md: '720px' }}
        alignItems={'center'}
        border={{ base: 'none', lg: `1px solid ${Colors.gray50}` }}
        borderRadius={'16px'}
        px={{ base: '16px', lg: '64px' }}
        py={{ base: '24px', lg: '32px' }}
      >
        {isDeclined ? (
          <Text
            fontSize={'2.5rem'}
            fontWeight={700}
            lineHeight={'24px'}
            letterSpacing={'-0.8px'}
            fontFamily="inherit"
          >
            🚫
          </Text>
        ) : (
          <img
            src="https://cdn3.emoji.gg/emojis/6685-star-struck-emoji.gif"
            width="64px"
            height="64px"
            alt="star_struck_emoji"
          />
        )}
        <Text
          fontSize={'1.25rem'}
          fontWeight={700}
          lineHeight={'24px'}
          letterSpacing={'-0.4px'}
          my={'8px'}
          fontFamily="inherit"
        >
          Booking {isDeclined ? 'Declined' : 'confirmed'}
        </Text>
        <Text
          textAlign={'center'}
          fontSize={'.875rem'}
          lineHeight={'22px'}
          mb={'16px'}
          color={Colors.gray400}
        >
          {isDeclined
            ? 'This calendar invite has been declined by the host'
            : 'A calendar invite has been sent to your email address.'}
        </Text>

        {isDeclined && (
          <Button
            size="medium"
            variant="outline"
            label="Contact Host"
            icon={<EmailIcon boxSize={'20px'} color={Colors.gray400} />}
            icontype="leading"
            color={Colors.gray400}
            flexGrow={1}
            onClick={() => {
              // TODO: Implement contact host functionality
            }}
            fontFamily="inherit"
            fontSize="14px"
          />
        )}

        <Divider my={'32px'} borderColor={Colors.gray50} />

        {hasRedirect && (
          <Box textAlign="center" pb={'24px'}>
            <Text
              fontSize={{ base: '.875rem', lg: '1.125rem' }}
              fontWeight={700}
              lineHeight={'20px'}
              letterSpacing={'-0.18px'}
              mb={'4px'}
            >
              You will be redirected shortly
            </Text>
            <Text fontSize={'0.8125rem'} lineHeight={'24px'} flexShrink={0}>
              in {countdown} seconds
            </Text>
          </Box>
        )}

        <Flex gap={'16px'} alignItems={'center'} pt="20px" pb={'24px'} width={'100%'}>
          <Box>
            {receiptData?.metadata?.service_id?.feature_image?.path ? (
              <img
                src={receiptData.metadata.service_id.feature_image.path}
                alt="featured image"
                width={64}
                height={48}
                style={{ borderRadius: '8px', objectFit: 'cover' }}
              />
            ) : (
              <Center width={'80px'} height={'60px'} borderRadius="8px" bgColor={Colors.gray50}>
                <InfoIcon boxSize={'24px'} color={Colors.gray400} />
              </Center>
            )}
          </Box>
          <Box>
            <Text
              fontSize={'.875rem'}
              fontWeight={600}
              lineHeight={'20px'}
              letterSpacing={'-0.14px'}
            >
              {receiptData?.metadata?.service_id?.name}
            </Text>
            <Text fontSize={'.75rem'} lineHeight={'20px'} color={Colors.gray400}>
              {formatDuration({ hour: 1, min: 0 })}{' '}
              {/* Default to 1 hour since duration is not in the response */}
            </Text>
          </Box>
        </Flex>

        <Divider borderColor={Colors.gray50} />

        <Flex flexDirection={'column'} width={'100%'} gap={'16px'} mt={'24px'}>
          <Flex justifyContent={'space-between'} alignItems={'center'}>
            <Text fontSize={'.875rem'} lineHeight={'20px'} color={Colors.gray400}>
              Date & Time
            </Text>
            <Text fontSize={'.875rem'} lineHeight={'20px'}>
              {dateTime?.toLocaleString(DateTime.DATE_HUGE)}{' '}
              {dateTime?.toLocaleString(DateTime.TIME_SIMPLE)}
            </Text>
          </Flex>

          <Flex justifyContent={'space-between'} alignItems={'center'}>
            <Text fontSize={'.875rem'} lineHeight={'20px'} color={Colors.gray400}>
              Amount
            </Text>
            <Text fontSize={'.875rem'} lineHeight={'20px'}>
              {receiptData?.metadata?.service_price} {receiptData?.metadata?.currency}
            </Text>
          </Flex>

          <Flex justifyContent={'space-between'} alignItems={'center'}>
            <Text fontSize={'.875rem'} lineHeight={'20px'} color={Colors.gray400}>
              Payment Reference
            </Text>
            <Text fontSize={'.875rem'} lineHeight={'20px'}>
              {receiptData?.payment_reference}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Receipt;
