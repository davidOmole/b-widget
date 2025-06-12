interface BookingWidgetOptions {
  type: 'inline' | 'popup' | 'popup_text';
  targetId: string;
  serviceId: string;
  slug: string;
  buttonText?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

declare global {
  interface Window {
    initBookingWidget: (options: BookingWidgetOptions) => void;
  }
}

(function () {
  // Create a unique ID for the widget
  const widgetId = 'booking-widget-' + Math.random().toString(36).substr(2, 9);

  // Function to create the iframe
  const createIframe = (serviceId: string, slug: string): HTMLIFrameElement => {
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '600px';
    iframe.style.border = 'none';
    iframe.src = `https://bookings-widgets.fly.dev/${slug}/${serviceId}`;
    iframe.title = 'Booking Widget';
    return iframe;
  };

  // Function to initialize the widget
  window.initBookingWidget = function (options: BookingWidgetOptions): void {
    const {
      type = 'inline',
      targetId,
      serviceId = 'your-service-id',
      slug = 'mikun',
      buttonText = 'Schedule a Meeting',
      onSuccess,
      onError,
    } = options;

    const target : HTMLElement = document.getElementById(targetId) || document.body;
    if (!target) {
      console.error('Target element not found');
      return;
    }
    if (type === 'inline') {
      // For inline embed, create container and iframe
      const container = document.createElement('div');
      container.id = widgetId;
      container.style.width = '100%';
      container.style.minHeight = '600px';
      container.appendChild(createIframe(serviceId, slug));
      target.appendChild(container);
    } else {
      // For popup and popup_text, create a button or link
      const button = document.createElement(type === 'popup' ? 'button' : 'a');
      button.textContent = buttonText;

      if (type === 'popup') {
        // Style for popup button
        button.style.padding = '12px 24px';
        button.style.borderRadius = '8px';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.backgroundColor = '#007AFF';
        button.style.color = 'white';
        button.style.fontWeight = '600';
        button.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
        button.style.transition = 'all 0.2s ease';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '999';

        // Add hover effect
        button.addEventListener('mouseover', () => {
          button.style.backgroundColor = '#0056b3';
          button.style.transform = 'translateY(-2px)';
        });

        button.addEventListener('mouseout', () => {
          button.style.backgroundColor = '#007AFF';
          button.style.transform = 'translateY(0)';
        });
      } else {
        // Style for popup text link
        button.style.color = '#007AFF';
        button.style.textDecoration = 'none';
        button.style.fontWeight = '500';
        button.style.cursor = 'pointer';
        button.style.display = 'inline-block';
        button.style.margin = '10px 0';

        // Add hover effect
        button.addEventListener('mouseover', () => {
          button.style.textDecoration = 'underline';
        });

        button.addEventListener('mouseout', () => {
          button.style.textDecoration = 'none';
        });
      }

      // Create modal container
      const modal = document.createElement('div');
      modal.style.display = 'none';
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100%';
      modal.style.height = '100%';
      modal.style.backgroundColor = '#050505cc';
      modal.style.zIndex = '1000';

      // Create modal content
      const modalContent = document.createElement('div');
      modalContent.style.position = 'relative';
      modalContent.style.width = '80%';
      modalContent.style.maxWidth = '800px';
      modalContent.style.margin = '50px auto';
      modalContent.style.backgroundColor = 'white';
      modalContent.style.padding = '20px';
      modalContent.style.borderRadius = '8px';

      // Add close button
      const closeButton = document.createElement('button');
      closeButton.textContent = '×';
      closeButton.style.position = 'absolute';
      closeButton.style.right = '10px';
      closeButton.style.top = '10px';
      closeButton.style.border = 'none';
      closeButton.style.background = 'none';
      closeButton.style.fontSize = '24px';
      closeButton.style.cursor = 'pointer';

      // Add event listeners
      button.addEventListener('click', (e: Event) => {
        e.preventDefault();
        modal.style.display = 'block';
      });

      closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
      });

      modal.addEventListener('click', (e: MouseEvent) => {
        if (e.target === modal) {
          modal.style.display = 'none';
        }
      });

      // Assemble the modal
      modalContent.appendChild(closeButton);
      modalContent.appendChild(createIframe(serviceId, slug));
      modal.appendChild(modalContent);

      // Add to the page
      target.appendChild(button);
      document.body.appendChild(modal);
    }

    // Add message listener for success/error events
    window.addEventListener('message', (event: MessageEvent) => {
      if (event.origin === `https://bookings-widgets.fly.dev/${slug}/${serviceId}`) {
        if (event.data.type === 'booking-success' && onSuccess) {
          onSuccess(event.data);
        } else if (event.data.type === 'booking-error' && onError) {
          onError(event.data.error);
        }
      }
    });
  };
})();

export default window.initBookingWidget;
