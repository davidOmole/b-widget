import type { StandaloneWidgetOptions } from '../../index.d.ts';
import { createRoot } from 'react-dom/client';
import React from 'react';
import { BookingWidget } from '../components/BookingWidget';

export function initBookingWidget(options: StandaloneWidgetOptions): void {
  const { target, serviceId, slug, type = 'inline' } = options;

  if (!target) {
    throw new Error('Target element is required');
  }

  const root = createRoot(target);
  root.render(
    React.createElement(BookingWidget, {
      serviceId,
      slug,
      type
    })
  );
} 