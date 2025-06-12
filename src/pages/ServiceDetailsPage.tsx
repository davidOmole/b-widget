import { Box, Center, Flex, Grid, GridItem, Img, Text, useDisclosure, VStack } from '@chakra-ui/react';
import {
  Colors,
  EnterpriseIcon,
  Heading,
  IconButton,
  Loader,
  LocationOnIcon,
  NotificationsFilledIcon,
  PaidIcon,
  Paragraph,
  ScheduleIcon,
  VideoCamIcon,
} from 'mainstack-design-system';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBookingsData, useGetSingleService, useGetTeamMemberSchedule } from '../api';
import { ElementToken } from '../api/types';
import DatePickerWrapper from '../components/DatePickerWrapper';
import InactiveState from '../components/InactiveState';
import ContactSellerModal from '../components/modals/ContactSellerModal';
import ReportPageModal from '../components/modals/ReportPageModal';
import ShareModal from '../components/modals/ShareModal';
import { EServiceLocation } from '../enums';
import { useBookingState } from '../hooks/useBookingState';
import { useCurrency } from '../hooks/useCurrency';
import { stringifyPrice } from '../utils';
import { formatDuration } from '../utils/formatDuration';
import { TIMEZONES } from '../utils/timezones';
import { useThemeColor } from '../hooks/useThemeColor';
import { motion } from 'framer-motion';

const MotionGrid = motion(Grid);
const MotionBox = motion(Box);

const ServiceDetailsPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [selectedMember, setSelectedMember] = useState('');
  const [is_booking_owner, setIsSelectedBookingOwner] = useState(false);
  const service_id = params.id as string;
  const calendarCard = useRef<any>(null);
  const { currency } = useCurrency();
  const { setBookingState } = useBookingState();

  const { isOpen: isOpenShare, onClose: onCloseShare, onOpen: onOpenShare } = useDisclosure();
  const { isOpen: isOpenReport, onClose: onCloseReport, onOpen: onOpenReport } = useDisclosure();
  const {
    isOpen: isOpenContactSellerModal,
    onOpen: onOpenContactSellerModal,
    onClose: onCloseContactSellerModal,
  } = useDisclosure();

  const userSlug = `${import.meta.env.VITE_BOOKINGS_URL}/${params?.slug}`;
  const fullUrl =
    import.meta.env.VITE_ENV === 'development'
      ? `https://mikun.${import.meta.env.VITE_BOOKINGS_URL}`
      : window.location.hostname;

  const host = params?.slug ? userSlug : fullUrl;

  const queryParams = useMemo(
    () => ({
      service_id,
      host,
      origin: window.location.origin,
      //member_id: selectedMember,
      currency: currency as string,
    }),
    [service_id, host, selectedMember, currency]
  );

  const {
    isLoading: isLoadingSingleService,
    isPending: singleServiceInfoPending,
    data: singleServiceInfo,
    error,
    refetch: refetchSingleService,
  } = useGetSingleService(queryParams);

  const { isLoading: isGettingMember, data: memberSchedule } = useGetTeamMemberSchedule({
    service_id,
    team_member_id: selectedMember,
    host,
  });
  const { data: bookingsData, isLoading: isLoadingBookingsData } = useBookingsData(host);

  const service = singleServiceInfo?.service;
  const element_token = singleServiceInfo?.token?.element_token as ElementToken;

  useThemeColor(bookingsData?.customization?.theme_color);

  const dayInMilliseconds = 24 * 60 * 60 * 1000;
  const sixMonthsInMilliseconds = 30 * dayInMilliseconds * 6;
  const currDate = new Date();
  currDate.setUTCHours(23, 59, 0, 0);
  const futureDate = new Date(currDate.getTime() + sixMonthsInMilliseconds);
  futureDate.setUTCSeconds(Math.ceil(futureDate.getUTCSeconds()));
  const formattedEndDate = futureDate.toISOString();

  const availability_id = useMemo(() => {
    if (!service) return null;

    const isManualStaffing = service.staff_selection?.type === 'manual_staffing';
    const isCustomerChooses = service.staff_selection?.type === 'customer_chooses';

    if (isManualStaffing || (isCustomerChooses && is_booking_owner)) {
      return service.booking?._id;
    }

    return selectedMember;
  }, [service, is_booking_owner, selectedMember]);

  const calendarOptions = useMemo(() => {
    if (!service || !element_token?.token) return null;

    return {
      config: {
        logs: 'error',
        tz_list: TIMEZONES,
      },
      element_token: element_token?.token,
      target_id: 'cronofy-date-time-picker',
      availability_query: {
        participants: [
          {
            required: 'all',
            members: [
              //@ts-ignore
              ...new Set<string>(element_token?.subs),
            ]?.map((sub: string, index: number) => ({
              sub,
              managed_availability: true,
              ...(index === 0 && {
                availability_rule_ids: [singleServiceInfo?.availability_rule_id],
              }),
              calendar_ids: singleServiceInfo?.conflict_calendars[sub] || [],
            })),
          },
        ],
        required_duration: {
          hours: service.duration.hour,
          minutes: service.duration.min,
        },
        query_periods: [
          {
            start: new Date().toISOString().split('.')[0] + 'Z',
            end: formattedEndDate,
          },
        ],
      },
      styles: {
        prefix: 'mainstack-cron',
      },
      callback: (res: any) => {
        if (res.notification.type !== 'slot_selected') {
          return;
        }
        setBookingState({
          slot: {
            ...res?.notification?.slot,
            timezone: res?.notification?.tzid,
          },
          host: selectedMember,
          allowedConferencingProfiles: singleServiceInfo?.conferencing_profiles as any[],
        });
        navigate(`checkout`);
      },
    };
  }, [
    element_token,
    singleServiceInfo,
    selectedMember,
    service,
    formattedEndDate,
    setBookingState,
    navigate,
  ]);

  useEffect(() => {
    if ((!singleServiceInfoPending && !singleServiceInfo && !service) || !element_token?.token) {
      refetchSingleService();
    }
  }, [singleServiceInfoPending, singleServiceInfo, service, navigate, element_token]);


  if (isLoadingSingleService || isGettingMember) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  if (!service) {
    return null;
  }

  const discountPrice = service?.price?.discount_price;

  console.log('element_token', bookingsData);
  return (
    <>
      {!bookingsData?.is_active ? (
        <InactiveState
          type="service"
          displayName={service?.name}
          serviceDetails={{
            price: service?.price as any,
            duration: service?.duration,
            location: service?.location,
            feature_image: service?.feature_image,
          }}
        />
      ) : (
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          maxWidth="978px" 
          mx="auto"
        >
          <MotionGrid
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            templateColumns="repeat(12, 1fr)"
            border={`1px solid ${Colors.gray50}`}
            borderRadius="16px"
            py="16px"
            pr="16px"
            maxWidth="978px"
            mx="auto"
          >
            <GridItem colSpan={{ base: 12, lg: 4 }} px={"0px"}>
              <VStack>
                <Box
                  border={{ base: 'none', lg: `1px solid ${Colors.gray50}` }}
                  p={{ base: '0px', lg: '16px' }}
                  borderRadius={'16px'}
                >
                  <Flex gap={'12px'} alignItems={'center'}>
                    {service?.feature_image?.path ? (
                      <Img
                        src={service?.feature_image?.path}
                        alt={service?.name}
                        width={{ base: '48px', lg: '80px' }}
                        height={{ base: '48px', lg: '60px' }}
                        borderRadius={'8px'}
                      />
                    ) : (
                      <Center
                        width={{ base: '48px', lg: '80px' }}
                        height={{ base: '48px', lg: '60px' }}
                        borderRadius="8px"
                        bgColor={Colors.gray50}
                      >
                        <EnterpriseIcon boxSize={'20px'} />
                      </Center>
                    )}
                    <Text
                      fontSize={'1.125rem'}
                      fontWeight={700}
                      lineHeight={'20px'}
                      letterSpacing={'-0.18px'}
                    >
                      {service?.name}
                    </Text>
                  </Flex>

                  <Box mt={'20px'}>
                    <Flex gap={'8px'} mb={'12px'} alignItems={'center'}>
                      <PaidIcon boxSize={'16px'} />
                      {Boolean(discountPrice) && (
                        <Text fontSize={'.875rem'} lineHeight={'22px'}>
                          {service?.price?.currency} {stringifyPrice(discountPrice)}
                        </Text>
                      )}
                      <Text
                        fontSize={'.875rem'}
                        lineHeight={'22px'}
                        textDecoration={Boolean(discountPrice) ? 'line-through' : 'none'}
                        color={Boolean(discountPrice) ? '#888f95' : 'inherit'}
                      >
                        {Boolean(service?.price?.price)
                          ? `${service?.price?.currency} ${stringifyPrice(service?.price?.price)}`
                          : 'Free'}
                      </Text>
                    </Flex>

                    <Flex gap={'8px'} mb={'12px'} alignItems={'center'}>
                      <ScheduleIcon boxSize={'16px'} />
                      <Text fontSize={'.875rem'} lineHeight={'22px'}>
                        {formatDuration(service?.duration)}
                      </Text>
                    </Flex>

                    <Flex gap={'8px'} mb={'12px'} alignItems={'center'}>
                      {service?.location?.type === 'online' && <VideoCamIcon boxSize={'16px'} />}
                      {service?.location?.type === 'in_person' && <LocationOnIcon boxSize={'16px'} />}
                      {service?.location?.type === EServiceLocation.online && (
                        <Text fontSize={'.875rem'} lineHeight={'22px'} textTransform={'capitalize'}>
                          {service?.location?.allowed_meeting_platforms?.length > 1
                            ? `${service?.location?.allowed_meeting_platforms?.length} Meeting Locations`
                            : service?.location?.allowed_meeting_platforms[0]}
                        </Text>
                      )}

                      {service?.location?.type === EServiceLocation.in_person && (
                        <Text fontSize={'.875rem'} lineHeight={'22px'} textTransform={'capitalize'}>
                          In Person
                        </Text>
                      )}
                    </Flex>
                  </Box>
                </Box>
                {/* <Flex alignItems={"center"} gap={"4px"} mt={"8px"} opacity={"0.5"}>
                  <Text
                    fontSize={"10px"}
                    color={Colors.gray500}
                    display={"inline-block"}
                    mr={"6px"}
                  >
                    POWERED BY
                  </Text>
                  <Flex
                    alignItems={"center"}
                    fontFamily={"Söhne Breit"}
                    fontWeight={600}
                    gap="2px"
                    letterSpacing="-0.32px"
                    lineHeight="20px"
                  >
                    <Img src={"https://res.cloudinary.com/mainstack-co/image/upload/v1694164800/images/app/mystack/full-logo.svg"} w={"90px"} />
                  </Flex>
                </Flex> */}
              </VStack>
            </GridItem>
            <GridItem colSpan={{ base: 12, lg: 8 }} position="relative" ref={calendarCard}>
              {/* {service.staff_selection?.type === "customer_chooses" && !selectedMember && (
                <ChooseGuest
                  members={service.staff_selection.members}
                  onSelectMember={(id) => {
                    setSelectedMember(id);
                    //refetch();
                  }}
                  toggleIsBookingOwner={(is_booking_owner) =>
                    setIsSelectedBookingOwner(is_booking_owner)
                  }
                />
              )} */}
              {(service.staff_selection?.type === 'manual_staffing' ||
                (service.staff_selection?.type === 'customer_chooses' && selectedMember)) && (
                  <Box
                    border={{ base: 'none', lg: `1px solid ${Colors.gray50}` }}
                    p={{ base: '0px', lg: '24px' }}
                    pb="24px"
                    borderRadius="16px"
                  >
                    {service.staff_selection?.type === 'customer_chooses' && (
                      <IconButton
                        size="medium"
                        variant="outline"
                        onClick={() => setSelectedMember('')}
                        mb="24px"
                      >
                        <NotificationsFilledIcon transform="rotate(-90deg)" boxSize="20px" />
                      </IconButton>
                    )}
                    <Flex>
                      <Box>
                        <Flex gap="12px" alignItems="center"></Flex>
                      </Box>
                      {element_token.token && (
                        <DatePickerWrapper
                          options={calendarOptions}
                          element_token={element_token?.token}
                        />
                      )}
                    </Flex>
                  </Box>
                )}
            </GridItem>
          </MotionGrid>

          <ShareModal
            isOpen={isOpenShare}
            onClose={onCloseShare}
            service={service_id}
            service_url={service.feature_image?.path}
          />
          <ReportPageModal isOpen={isOpenReport} onClose={onCloseReport} />
          <ContactSellerModal
            isOpen={isOpenContactSellerModal}
            onClose={onCloseContactSellerModal}
            sellerDetails={bookingsData}
          />
        </MotionBox>
      )}
    </>
  );
};

export default ServiceDetailsPage;
