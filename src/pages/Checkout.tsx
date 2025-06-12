import { AddIcon, InfoIcon } from '@chakra-ui/icons';
import { Box, IconButton as ChakraIconButton, Flex, Text } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { DateTime } from 'luxon';
import {
  Button,
  customSnackbar,
  Input,
  Loader,
  PhoneNumberInput,
  RadioButton,
  RectangleCheckButton,
  SelectInput,
  SnackbarType,
  TextArea,
  TrashDeleteBinIcon,
} from 'mainstack-design-system';
import { MainstackPayments, MainstackPaymentsProvider } from 'mainstack-payments';
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import * as yup from 'yup';
import {
  useBookAppointment,
  useBookFreeAppointment,
  useBookingsData,
  useGetSingleService,
  useIpData,
  useServices,
} from '../api';
import { CustomMeetingPlatformOptionLabel } from '../components/CustomMeetingPlatformOptionLabel';
import { useBookingState } from '../hooks/useBookingState';
import { useCurrency } from '../hooks/useCurrency';
import { useEventCapture } from '../hooks/useEventCapture';
import { formatDuration } from '../utils/formatDuration';
import { resolveAllowedConferencingOptions } from '../utils/resolveAllowedConferencingProfiles';
import { VALIDATIONS } from '../utils/validations';
import { Duration } from '../api/types';

const Checkout = () => {
  const { registerEvent } = useEventCapture({
    apiKey: import.meta.env.VITE_EVENT_TRACKING_API_KEY,
  });
  const params = useParams();
  const navigate = useNavigate();

  const [ref4] = useState(uuidv4());
  const { currency, setCurrency } = useCurrency();
  const { bookingState, setBookingState } = useBookingState();
  const originUrl = window.location.origin;
  const serviceId = params?.id;
  const userSlug = `${import.meta.env.VITE_BOOKINGS_URL}/${params?.slug}`;
  const fullUrl =
    import.meta.env.VITE_ENV === 'development'
      ? `https://mikun.${import.meta.env.VITE_BOOKINGS_URL}`
      : window.location.hostname;
  const host = params?.slug ? userSlug : fullUrl;

  const queryParams = useMemo(
    () => ({
      service_id: serviceId,
      host,
      origin: window.location.origin,
      //member_id: selectedMember,
      currency: currency as string,
    }),
    [serviceId, host, currency]
  );

  const { data: ipData } = useIpData();
  const { data: userDetails } = useBookingsData(host);
  const { data: servicesData, isLoading: isLoadingServices } = useServices(host, currency || 'USD');
  const { data: bookingData, isLoading: isLoadingBooking } = useBookingsData(host);
  const {
    isPending,
    data: singleServiceInfo,
    isError,
  } = useGetSingleService(queryParams as any);

  // Update currency when IP data changes
  useEffect(() => {
    if (ipData?.currency) {
      setCurrency(ipData.currency);
    }
  }, [ipData?.currency, setCurrency]);

  // useEffect(() => {
  //   registerEvent({
  //     event_name: "bookings_checkout_initialization",
  //     event_data: {
  //       event_type: "Tracking when customer lands on checkout page on bookings widget",
  //       service_id: singleServiceInfo?.service?._id,
  //       service_name: singleServiceInfo?.service?.name,
  //     },
  //   });

  //   if (!singleServiceInfo?.service) {
  //     navigate('/');
  //   }
  // }, [singleServiceInfo?.service, registerEvent, navigate]);

  const service = singleServiceInfo?.service;
  const allowedConferencingProfiles = useMemo(() => {
    const platforms = singleServiceInfo?.conferencing_profiles ?? [];
    return platforms.map(platform => ({
      provider_name: platform.provider_name.toLowerCase().replace(/\s+/g, ''),
      profile_id: platform.profile_id,
    }));
  }, [singleServiceInfo?.conferencing_profiles]);

  const discountPrice = service?.price?.discount_price ?? 0;

  const { mutate: bookAppointment } = useBookAppointment();
  const { mutate: bookFreeAppointment, isPending: isBookingFree } = useBookFreeAppointment();
  const { data: bookingsData } = useBookingsData(host);
  const metadata = {
    service_id: service?._id ?? '',
    service_name: service?.name ?? '',
    service_price: discountPrice > 0 ? discountPrice : (service?.price?.price ?? 0),
    user_id: userDetails?.user,
    account_id: userDetails?.account?._id,
    booking_id: service?.booking,
    productName: service?.name,
    productImage: service?.feature_image?.path ??
    `${import.meta.env.VITE_CLOUDINARY_UPLOAD}bookings/product_image.png`,
    product_id: service?._id,
    type: 'appointment',
    start: bookingState?.slot?.start,
    end: bookingState?.slot?.end,
  };

  const serviceHasCustomLink =
    service?.location?.allowed_meeting_platforms?.includes('Custom Link');
  const displayCustomLink = service?.location?.display_custom_link;
  const form_response =
    service?.form_info?.map((form: any) => ({ ...form, field_answer: '' })) ?? [];

  const validationSchema = yup.object().shape({
    form_response: VALIDATIONS.form_response,
    ...(service?.location?.type === 'online' &&
      !serviceHasCustomLink && {
      conferencing_profile_id: VALIDATIONS.conferencing_profile_id,
    }),
  });

  const formik = useFormik({
    initialValues: {
      additional_details: '',
      other_guests: [],
      conferencing_profile_id: undefined,
      form_response,
    },
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      const formResponse = formik.values.form_response?.map((formRes: any) => {
        if (formRes.field_type === 'dropdown') {
          return { ...formRes, field_answer: formRes?.field_answer?.value };
        } else {
          return formRes;
        }
      });
      const hasEmptyFields = formResponse.some(
        (field: any) => field?.is_field_required && !field.field_answer
      );
      if (hasEmptyFields) {
        customSnackbar('Please fill in all required fields', SnackbarType.error);
        setSubmitting(false);
        return;
      }
    },
  });

  // Guard to ensure onPaymentSuccess only runs once
  const paymentHandledRef = useRef(false);

  const onPaymentSuccess = useCallback((payload: {
    amount: any; reference: string; fullname: string; email: string 
}) => {
    // Guard: Only allow the first call
    if (paymentHandledRef.current) {
      return;
    }
    paymentHandledRef.current = true;
    console.log("payload:::::::>", payload);
    registerEvent({
      event_name: 'bookings_checkout_payment_completion',
      event_data: {
        event_type: 'Tracking when payment is successful on bookings public page',
        service_id: service?._id,
        service_name: service?.name,
        amount: discountPrice > 0 ? discountPrice : (Number(service?.price?.price) ?? 0),
        currency: currency,
      },
    });

    //const amount = discountPrice > 0 ? discountPrice : (Number(service?.price?.price) ?? 0);
    const amount = payload.amount;
    const formResponse = formik.values.form_response?.map((formRes: any) => {
      if (formRes.field_type === 'dropdown') {
        return { ...formRes, field_answer: formRes?.field_answer?.value };
      } else {
        return formRes;
      }
    });

    if (amount === 0) {
      bookFreeAppointment(
        {
          payment_reference: payload.reference,
          metadata,
          host_integration: service?.host_integration as string,
          conferencing_profile_id: formik.values?.conferencing_profile_id as unknown as string,
          start: bookingState?.slot?.start ?? '',
          end: bookingState?.slot?.end ?? '',
          time_zone: bookingState?.slot?.timezone ?? '',
          form_response: [...formResponse],
          other_guests: formik.values.other_guests?.map((guest: { email: string }) => guest.email),
          full_name: payload.fullname,
          email: payload.email,
          ...(service?.host && { host: service.host }),
        },
        {
          onSuccess(data) {
            customSnackbar(
              'Your appointment has been scheduled successfully!',
              SnackbarType.success
            );
            if (service?.additional_details?.redirect_on_success) {
              sessionStorage.setItem('with_redirect', 'true');
            }
            navigate(`/receipt/${data?.payment_reference}`);
          },
          onError(error: any) {
            console.log('error', error);
            //customSnackbar(error?.response?.data ?? error, SnackbarType.error);
          },
        }
      );
      return;
    }
    bookAppointment(
      {
        payment_reference: payload.reference,
        metadata,
        start: bookingState?.slot?.start ?? '',
        end: bookingState?.slot?.end ?? '',
        time_zone: bookingState?.slot?.timezone ?? '',
        form_response: [...formResponse],
        other_guests: formik.values.other_guests?.map((guest: { email: string }) => guest.email),
        full_name: payload.fullname,
        email: payload.email,
        ...(service?.host && { host: service.host }),
        host_integration: service?.host_integration as string,
        conferencing_profile_id: formik.values?.conferencing_profile_id as unknown as string,
      },
      {
        onSuccess() {
          customSnackbar('Your purchase is successful', SnackbarType.success);
          const redirectUrl = service?.additional_details?.redirect_success_url;
          if (redirectUrl) {
            sessionStorage.setItem('with_redirect', 'true');
          }
          navigate(`/receipt/${payload.reference}`);
        },
        onError(error: any) {
          console.error(error);
          //customSnackbar(error?.response?.data ?? error, SnackbarType.error);
        },
      }
    );
  }, [discountPrice, currency, service, bookingState, formik, bookAppointment, bookFreeAppointment, navigate, registerEvent]);

  const displayCurrency = service?.price?.currency ?? currency;
  const paymentRef = useRef<HTMLDivElement>(null);

  const handleFormUpdate = (obj: string, val: any) => {
    formik.setFieldValue(obj, val);
  };

  const checkFormError = (id: number) => {
    const index = formik.values?.form_response?.findIndex((form: any) => form?._id === id);
    let errors: any = formik?.errors,
      touched: any = formik?.touched;
    return {
      error: errors?.form_response?.[index]?.field_answer && touched[id],
      message: errors?.form_response?.[index]?.field_answer,
    };
  };

  const FormInput = (form: any) => {
    switch (form?.field_type) {
      case 'phone_number':
        return (
          <Box position="relative" zIndex="9">
            <PhoneNumberInput
              value={form?.field_answer}
              onChange={(val: any) => {
                const updatedForm = formik.values?.form_response.map((form_res: any) => {
                  if (form_res._id === form?._id) {
                    return {
                      ...form_res,
                      field_answer: val,
                    };
                  }
                  return form_res;
                });
                handleFormUpdate('form_response', updatedForm);
              }}
              placeholder=""
              label={`${form?.field_title} ${form?.is_field_required ? '*' : ''}`}
              subtext="By entering your phone number, you agree to Mainstack's SMS Terms of Service and Privacy Policy. Mainstack will share your phone number with the seller of this product(s) or service(s). Message and data rates may apply."
              fontFamily={'inherit'}
            />
            {checkFormError(form?._id)?.error && (
              <Flex alignItems={'center'} gap="6px" mt={'4px'}>
                <InfoIcon color="red.500" />
                <Text color="red.500" fontSize="xs" fontFamily={'inherit'}>
                  {checkFormError(form?._id)?.message}
                </Text>
              </Flex>
            )}
          </Box>
        );

      case 'short_text':
        return (
          <Input
            id={form?._id}
            label={`${form?.field_title} ${form?.is_field_required ? '*' : ''}`}
            name={form?._id}
            onChange={(e: any) => {
              const updatedForm = formik.values?.form_response.map((form_res: any) => {
                if (form_res._id === form?._id) {
                  return {
                    ...form_res,
                    field_answer: e.target.value,
                  };
                }
                return form_res;
              });
              handleFormUpdate('form_response', updatedForm);
            }}
            value={form?.field_answer}
            placeholder=""
            type="text"
            fontFamily={'inherit'}
            error={checkFormError(form?._id)?.error}
            errorMessage={checkFormError(form?._id)?.message}
          />
        );

      case 'long_text':
        return (
          <TextArea
            label={`${form?.field_title} ${form?.is_field_required ? '*' : ''}`}
            name={form?._id}
            id={form?._id}
            onChange={(e: any) => {
              const updatedForm = formik.values?.form_response.map((form_res: any) => {
                if (form_res._id === form?._id) {
                  return {
                    ...form_res,
                    field_answer: e.target.value,
                  };
                }
                return form_res;
              });
              handleFormUpdate('form_response', updatedForm);
            }}
            value={form?.field_answer}
            fontFamily={'inherit'}
            error={checkFormError(form?._id)?.error}
            errorMessage={checkFormError(form?._id)?.message}
          />
        );

      case 'radio_buttons':
        return (
          <Box>
            <Text color="blackAlpha.700" fontWeight={600} mb={'10px'}>{`${form?.field_title
              } ${form?.is_field_required ? '*' : ''}`}</Text>
            {form?.field_options.map((option: any, index: number) => (
              <Box mb={'10px'} key={index}>
                <RadioButton
                  value={option}
                  label={option}
                  name={form?._id}
                  id={form?._id}
                  onChange={(e: any) => {
                    const updatedForm = formik.values?.form_response.map((form_res: any) => {
                      if (form_res._id === form?._id) {
                        return {
                          ...form_res,
                          field_answer: e.target.value,
                        };
                      }
                      return form_res;
                    });
                    handleFormUpdate('form_response', updatedForm);
                  }}
                  isChecked={form?.field_answer === option}
                  fontFamily={'inherit'}
                />
              </Box>
            ))}
            {checkFormError(form?._id)?.error && (
              <Flex alignItems={'center'} gap="6px">
                <InfoIcon color="red.500" />
                <Text color="red.500" fontSize="xs" fontFamily={'inherit'}>
                  {checkFormError(form?._id)?.message}
                </Text>
              </Flex>
            )}
          </Box>
        );

      case 'checkboxes':
        return (
          <Box>
            <Text color="blackAlpha.700" fontWeight={600} mb={'10px'}>{`${form?.field_title
              } ${form?.is_field_required ? '*' : ''}`}</Text>
            {form?.field_options.map((option: any, index: number) => (
              <Box mb={'10px'} key={index}>
                <RectangleCheckButton
                  value={option}
                  label={option}
                  name={form?._id}
                  id={form?._id}
                  onChange={(e: any) => {
                    const updatedForm = formik.values?.form_response.map((form_res: any) => {
                      if (form_res._id === form?._id) {
                        const fieldAnswer = form_res?.field_answer.includes(e.target.value)
                          ? form_res?.field_answer.filter((value: any) => value !== e.target.value)
                          : [...form_res?.field_answer, e.target.value];
                        return {
                          ...form_res,
                          field_answer: fieldAnswer,
                        };
                      }
                      return form_res;
                    });
                    handleFormUpdate('form_response', updatedForm);
                  }}
                  isChecked={form?.field_answer.includes(option)}
                  fontFamily={'inherit'}
                />
              </Box>
            ))}
            {checkFormError(form?._id)?.error && (
              <Flex alignItems={'center'} gap="6px">
                <InfoIcon color="red.500" />
                <Text color="red.500" fontSize="xs" fontFamily={'inherit'}>
                  {checkFormError(form?._id)?.message}
                </Text>
              </Flex>
            )}
          </Box>
        );

      case 'dropdown':
        const options = form?.field_options.map((option: any) => ({
          value: option,
          label: option,
        }));
        return (
          <Box>
            <SelectInput
              label={`${form?.field_title} ${form?.is_field_required ? '*' : ''}`}
              name={form?._id}
              id={form?._id}
              onChange={(e: any) => {
                const updatedForm = formik.values?.form_response.map((form_res: any) => {
                  if (form_res._id === form?._id) {
                    return {
                      ...form_res,
                      field_answer: e.value,
                    };
                  }
                  return form_res;
                });
                handleFormUpdate('form_response', updatedForm);
              }}
              value={options.find(
                (opt: { value: string; label: string }) => opt.value === form?.field_answer?.value
              )}
              options={options}
            />
            {checkFormError(form?._id)?.error && (
              <Flex alignItems={'center'} gap="6px">
                <InfoIcon color="red.500" />
                <Text color="red.500" fontSize="xs" fontFamily={'inherit'}>
                  {checkFormError(form?._id)?.message}
                </Text>
              </Flex>
            )}
          </Box>
        );

      default:
        return null;
    }
  };
  const dateTime = DateTime.fromISO(bookingState?.slot?.start ?? '');
  const amount = Number(service?.price?.price) ?? 0;

  const storedIpData = window.localStorage?.getItem('userIp');
  const userIpData = storedIpData ? JSON.parse(storedIpData) : null;

  const config = useMemo(
    () => ({
      accountId: bookingsData?.account?._id ?? '',
      currency,
      amount,
      transactionFeesSlug: 'bookings-pro-plan',
      userAllowsWalletPayment: bookingData?.payment_settings?.allow_wallet_payment ?? false,
      userAllowsCardPayment: bookingData?.payment_settings?.allow_card_payment ?? false,
      baseUrl: import.meta.env.VITE_BASE_URL,
      paymentRedirectUrl: `${window.location.origin}/payment-redirect`,
      STRIPE_SECRET_KEY: import.meta.env.VITE_STRIPE_SECRET_KEY,
      STRIPE_SECRET_KEY_GBP: import.meta.env.VITE_STRIPE_SECRET_KEY_GBP,
      STRIPE_SECRET_KEY_CAD: import.meta.env.VITE_STRIPE_SECRET_KEY_CAD,
      metadata: {
        mainstack_product_type: 'bookings' as const,
        ...metadata,
      },
      customizations: {
        button_label: amount === 0 ? `Book Appointment` : `Pay for Appointment`,
      },
      ip: userIpData?.ip,
      merchantCountry: bookingsData?.account?.business_country,
      shouldApplyTax: true,
    }),
    [currency, amount, bookingsData?.account?.business_country]
  );

  const availableLocationOptions = resolveAllowedConferencingOptions({
    conferencingProfiles: allowedConferencingProfiles as any,
    serviceCustomLink: service?.location?.custom_meeting_link,
    serviceHasCustomLink: serviceHasCustomLink,
    displayCustomLink,
  });

  

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Box maxW={'978px'} maxH={'710px'} overflowY={'auto'} >
      {!Boolean(singleServiceInfo) ? (
        <Loader />
      ) : (
        <>
          <MainstackPaymentsProvider>
            <MainstackPayments
              paymentConfig={config}
              onGoBack={handleGoBack}
              onPaymentComplete={(payload: any) => onPaymentSuccess(payload)}
              summaryTitle={
                <>
                  <Text fontSize={'.875rem'} lineHeight={'22px'}>
                    {service?.name} - {formatDuration(service?.duration as Duration)}
                  </Text>
                  <Text fontSize={'.875rem'} lineHeight={'22px'}>
                    {dateTime?.toLocaleString(DateTime.DATE_HUGE)}{' '}
                    {dateTime?.toLocaleString(DateTime.TIME_SIMPLE)} ( {bookingState?.slot?.timezone}{' '}
                    )
                  </Text>
                </>
              }
              customForm={
                <>
                  {formik.values?.form_response?.map((form: any) => FormInput(form))}
                  {formik.values?.other_guests?.map(
                    ({ email, id }: { email: string; id: string }) => (
                      <Flex key={id} alignItems="end" gap={'8px'}>
                        <Input
                          id={`guest-${id}`}
                          label={`Guest Email`}
                          name={`guest-${id}`}
                          onChange={(e: any) => {
                            const newGuests = formik.values.other_guests.map(
                              (guest: { email: string; id: string }) => {
                                if (id === guest.id) {
                                  return {
                                    ...guest,
                                    email: e.target.value,
                                  };
                                }
                                return guest;
                              }
                            );
                            formik.setFieldValue('other_guests', newGuests);
                          }}
                          value={email}
                          placeholder=""
                          type="email"
                          fontFamily={'inherit'}
                        />

                        <ChakraIconButton
                          size="md"
                          variant="outline"
                          mb="10px"
                          onClick={() => {
                            const newGuests = formik.values.other_guests.filter(
                              (guest: { id: string }) => id !== guest.id
                            );
                            formik.setFieldValue('other_guests', newGuests);
                          }}
                          icon={<TrashDeleteBinIcon boxSize={'20px'} />}
                          aria-label="Remove guest"
                        />
                      </Flex>
                    )
                  )}

                  {singleServiceInfo?.service?.location?.type !== 'in_person' &&
                    singleServiceInfo?.conferencing_profiles?.length && (
                      <Box textAlign={'left'}>
                        <SelectInput
                          label={'Meeting Platform'}
                          id={'conferencing_profile_id'}
                          name={'conferencing_profile_id'}
                          placeholder={'Select Meeting Platform'}
                          options={availableLocationOptions}
                          formatOptionLabel={(data: any) => (
                            <CustomMeetingPlatformOptionLabel label={data.label} img={data.img} />
                          )}
                          onChange={(e: any) => {
                            formik.setFieldValue('conferencing_profile_id', e.value);
                          }}
                        />
                        {formik?.errors?.conferencing_profile_id && (
                          <Text color="red.500" fontSize="xs" fontFamily={'inherit'} mt={'4px'}>
                            {formik?.errors?.conferencing_profile_id as any}
                          </Text>
                        )}
                      </Box>
                    )}

                  {service?.additional_details?.allow_invitees_add_guests && (
                    <Button
                      size="medium"
                      variant="outline"
                      label="Add guests"
                      icon={<AddIcon boxSize={'20px'} />}
                      icontype="leading"
                      onClick={() => {
                        formik.setFieldValue('other_guests', [
                          ...formik.values.other_guests,
                          {
                            email: '',
                            id: uuidv4(),
                          },
                        ]);
                      }}
                      fontFamily="inherit"
                    />
                  )}
                </>
              }
              onInitializePayment={async () => {
                registerEvent({
                  event_name: 'bookings_checkout_payment_initialization',
                  event_data: {
                    event_type: 'Tracking when payment is initialized on bookings public page',
                  },
                });
                formik.setTouched(
                  formik.values?.form_response?.reduce((acc: any, form: any) => {
                    acc[form._id] = true;
                    return acc;
                  }, {})
                );
                const errors = await formik.validateForm();
                if (Object.keys(errors).length <= 0) {
                  return { terminate: false };
                }
                return { terminate: true };
              }}
              onError={error => {
                console.log('error', error);
                customSnackbar(
                  error?.message || 'An error occurred please try again.',
                  SnackbarType.error
                );
                navigate(-1);
              }}
            />
          </MainstackPaymentsProvider>
        </>
      )}
    </Box>
  );
};

export default Checkout;
