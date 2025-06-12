import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

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
