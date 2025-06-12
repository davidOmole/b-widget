import { useCallback } from 'react';

interface EventData {
  event_name: string;
  event_data: {
    event_type: string;
    [key: string]: any;
  };
}

interface EventCaptureOptions {
  apiKey?: string;
  endpoint?: string;
}

export const useEventCapture = (options: EventCaptureOptions = {}) => {
  const { apiKey, endpoint = 'https://api.mainstack.co/events' } = options;

  const registerEvent = useCallback(
    async (event: EventData) => {
      try {
        if (!apiKey) {
          console.warn('Event tracking API key not provided');
          return;
        }

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            ...event,
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            platform: 'web',
          }),
        });

        if (!response.ok) {
          throw new Error(`Event tracking failed: ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        console.error('Error tracking event:', error);
        // In production, you might want to queue failed events for retry
      }
    },
    [apiKey, endpoint]
  );

  return { registerEvent };
};
