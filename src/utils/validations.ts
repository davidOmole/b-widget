import * as yup from 'yup';

export const VALIDATIONS = {
  form_response: yup.array().of(
    yup.object().shape({
      field_title: yup.string().required(),
      field_type: yup.string().required(),
      is_field_required: yup.boolean().required(),
      field_answer: yup.mixed().when('is_field_required', {
        is: true,
        then: schema => schema.required('This field is required'),
      }),
    })
  ),
  conferencing_profile_id: yup.string().required('Please select a meeting platform'),
};
