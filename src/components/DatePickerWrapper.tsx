import React, { useEffect, useState } from 'react';
import * as CronofyElements from 'cronofy-elements';

interface DatePickerWrapperProps {
  options: any;
  element_token: string;
}

const DatePickerWrapper = ({ options, element_token }: DatePickerWrapperProps) => {
  const [element, setElement] = useState<any>(null);

  useEffect(() => {
    let newOptions = { ...options, element_token };
    if (!element) {
      setElement(CronofyElements?.DateTimePicker(newOptions));
    }
  }, []);

  useEffect(() => {
    let newOptions = { ...options, element_token };
    if (element) {
      element.update(newOptions);
    }
  }, [options]);

  return <div id="cronofy-date-time-picker" />;
};

export default DatePickerWrapper;
