import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Log all environment variables
console.log('Environment Variables:', {
  NODE_ENV: import.meta.env.MODE,
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_APP_ENV: import.meta.env.VITE_APP_ENV,
  VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION,
  VITE_BASE_URL: import.meta.env.VITE_BASE_URL,
  VITE_BOOKINGS_URL: import.meta.env.VITE_BOOKINGS_URL,
  VITE_CLOUDINARY_UPLOAD: import.meta.env.VITE_CLOUDINARY_UPLOAD,
  VITE_ENV: import.meta.env.VITE_ENV,
  VITE_FLUTTERWAVE_PUBLIC_KEY: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
  VITE_GEOAPIFY_KEY: import.meta.env.VITE_GEOAPIFY_KEY,
  VITE_IPAPI_KEY: import.meta.env.VITE_IPAPI_KEY,
  VITE_PAYSTACK_SECRET_KEY: import.meta.env.VITE_PAYSTACK_SECRET_KEY
});

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(container);
root.render(
  React.createElement(React.StrictMode, null,
    React.createElement(App)
  )
);

console.log('Widget main.tsx loaded');

interface MountOptions {
  initialPath?: string;
}

// Create a global mount function
const mount = (container: HTMLElement, options: MountOptions = {}) => {
  console.log('Mounting widget to container:', container);
  console.log('Mount options:', options);
  
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App initialPath={options.initialPath} />
    </React.StrictMode>
  );
  return root;
};

// Create a global unmount function
const unmount = (container: HTMLElement) => {
  console.log('Unmounting widget from container:', container);
  const root = ReactDOM.createRoot(container);
  root.unmount();
};

// Expose the mount and unmount functions globally
const WidgetApp = {
  mount,
  unmount
};

console.log('Setting up WidgetApp on window:', WidgetApp);
(window as any).WidgetApp = WidgetApp;

// If we're running in development, mount to the default container
if (process.env.NODE_ENV === 'development') {
  const container = document.getElementById('root');
  if (container) {
    mount(container);
  }
}
