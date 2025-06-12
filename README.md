# Mainstack Bookings Widget

A customizable booking widget from Mainstack that can be used both as a React component and as a standalone widget.

## Installation

```bash
npm install mainstack-bookings-widget
# or
yarn add mainstack-bookings-widget
```

## Usage

### As a React Component

```jsx
import { BookingWidget } from 'mainstack-bookings-widget';

function App() {
  return (
    <BookingWidget
      serviceId="your-service-id"
      slug="your-slug"
    />
  );
}
```

### As a Standalone Widget

Add the script to your HTML:

```html
<script src="https://unpkg.com/mainstack-bookings-widget/dist/embed.js"></script>
```

Initialize the widget:

```javascript
initBookingWidget({
  type: 'inline', // or 'popup'
  target: document.getElementById('booking-widget'),
  serviceId: 'your-service-id',
  slug: 'your-slug'
});
```

## Props

### BookingWidget Component

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| serviceId | string | Yes | The ID of the service to book |
| slug | string | Yes | The slug of the service |
| type | 'inline' \| 'popup' | No | The type of widget to display (default: 'inline') |

### Standalone Widget

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| type | 'inline' \| 'popup' | Yes | The type of widget to display |
| target | HTMLElement | Yes | The element to mount the widget to |
| serviceId | string | Yes | The ID of the service to book |
| slug | string | Yes | The slug of the service |

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build the package
npm run build

# Run tests
npm test
```

## License

MIT
