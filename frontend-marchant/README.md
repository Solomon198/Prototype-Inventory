# Inventory Management Frontend

A modern React TypeScript frontend application for the Inventory Management System, built with Vite and Tailwind CSS.

## Features

- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for modern, responsive styling
- **React Router** for navigation
- **Axios** for API communication
- **Lucide React** for beautiful icons
- **Modern UI** with clean, professional design
- **Authentication System** with login page and protected routes

## Dashboard Sections

### Data Types

- View all data types in a clean table layout
- Create new data types with type selection (string, number, boolean, date, array, object)
- Delete data types with confirmation
- Modal forms with validation

### Marchants

- View all marchants with contact information
- Create new marchants with full contact details (name, email, phone, address)
- Delete marchants with confirmation
- Modal forms with email/phone validation

### Fields

- View all fields with their associated data types and marchants
- **Dropdown for Data Types** (populated from API)
- **Dropdown for Marchants** (populated from API)
- Set required/optional status with checkbox
- Set default values
- Delete fields with confirmation

### Modules

- View all modules with their associated marchants
- **Dropdown for Marchants** (populated from API)
- Create new modules with marchant selection
- Delete modules with confirmation

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Backend server running on `http://localhost:3000`

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Authentication

The application includes a secure authentication system:

- **Login Page**: Beautiful, responsive login form with name and password fields
- **Protected Routes**: All dashboard routes are protected and require authentication
- **Session Management**: Uses localStorage to persist login state
- **Logout Functionality**: Secure logout with session cleanup

### Login API

The login system sends a POST request to `/api/login` with the following payload:

```json
{
  "name": "user_name"
}
```

Expected response:

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "name": "user_name"
  }
}
```

## API Integration

The frontend connects to the backend API at `http://localhost:3000/api` and includes:

- **Authentication API**: `/api/login`
- **Data Types API**: `/api/data-types`
- **Marchants API**: `/api/marchants`
- **Fields API**: `/api/fields`
- **Modules API**: `/api/modules`

## Project Structure

```
src/
├── components/
│   ├── Dashboard.tsx          # Main dashboard layout with logout
│   ├── Login.tsx              # Authentication login page
│   ├── ProtectedRoute.tsx     # Route protection component
│   ├── DataTypes.tsx          # Data types management
│   ├── Fields.tsx             # Fields management with dropdowns
│   ├── Marchants.tsx          # Marchants management
│   └── Modules.tsx            # Modules management with dropdowns
├── services/
│   ├── api.ts                 # API configuration
│   └── authService.ts         # Authentication service
├── types/
│   └── index.ts               # TypeScript type definitions
├── lib/
│   └── utils.ts               # Utility functions
├── App.tsx                    # Main app component with routing
├── main.tsx                   # App entry point
└── index.css                  # Global styles with Tailwind
```

## UI Features

- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Modal Forms**: Clean, accessible modal interfaces for creating new items
- **Dynamic Dropdowns**: Dropdowns that populate from API data
- **Error Handling**: User-friendly error messages with proper styling
- **Loading States**: Loading indicators during API calls
- **Confirmation Dialogs**: Delete confirmations for data safety
- **Hover Effects**: Interactive hover states for better UX
- **Modern Tables**: Clean, sortable tables with proper spacing
- **Badge Indicators**: Color-coded badges for status and types

## Technology Stack

- **React**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Navigation
- **Axios**: HTTP client
- **Lucide React**: Icon library

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features

1. Create new components in the `components/` directory
2. Add API functions in `services/api.ts`
3. Define types in `types/index.ts`
4. Update the dashboard navigation if needed

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Design System

The application uses a consistent design system with:

- **Colors**: Blue primary, gray neutrals, red for destructive actions
- **Typography**: Inter font family with proper hierarchy
- **Spacing**: Consistent spacing using Tailwind's spacing scale
- **Components**: Reusable button, input, and modal components
- **Icons**: Lucide React icons for consistency
