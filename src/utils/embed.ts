import type { BookingWidgetOptions } from '../../index.d.ts';
import { createRoot } from 'react-dom/client';
import React from 'react';
import { BookingWidget } from '../components/BookingWidget';

export function initBookingWidget(options: BookingWidgetOptions): void {
  const { targetId, serviceId, type, buttonText, onSuccess, onError } = options;

  const target = document.getElementById(targetId);
  if (!target) {
    throw new Error('Target element not found');
  }

  const root = createRoot(target);
  root.render(
    React.createElement(BookingWidget, {
      serviceId,
      embedType: type,
      buttonText,
      onSuccess: onSuccess ? () => onSuccess({}) : undefined,
      onError: onError ? (error: Error) => onError(error) : undefined
    })
  );
} 