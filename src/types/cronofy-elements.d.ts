declare module 'cronofy-elements' {
  interface DateTimePickerOptions {
    element_token: string;
    [key: string]: any;
  }

  interface DateTimePicker {
    update(options: DateTimePickerOptions): void;
  }

  export const DateTimePicker: (options: DateTimePickerOptions) => DateTimePicker;
}
