# ASP.NET CRUD Client

A Vue.js frontend client for the ASP.NET Core CRUD API. This project demonstrates a modern Vue.js application that interacts with a RESTful API for managing products and categories.

## Features

- User authentication with JWT
- Product management (CRUD operations)
- Category management (CRUD operations)
- Responsive UI with Bootstrap 5
- State management with Pinia
- TypeScript for type safety
- Environment configuration

## Technologies Used

- Vue.js 3 with Composition API
- TypeScript
- Pinia for state management
- Vue Router for routing
- Axios for API requests
- Bootstrap 5 for UI components

## Prerequisites

- Node.js 18+
- NPM or Yarn

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mrhonek/dotnetcrudclient.git
   cd dotnetcrudclient
   ```

2. Install dependencies:
   ```bash
   npm install
   # OR
   yarn install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the API URL to point to your backend

### Development

Run the development server:
```bash
npm run dev
# OR
yarn dev
```

### Building for Production

```bash
npm run build
# OR
yarn build
```

## Project Structure

- `src/components` - Reusable Vue components
- `src/views` - View components mapped to routes
- `src/services` - API and service layer
- `src/stores` - Pinia state management
- `src/router` - Vue Router configuration

## Deployment

This application can be deployed on Railway:

1. Create a new Railway project
2. Connect your GitHub repository
3. Configure environment variables:
   - `VITE_API_URL`: URL of your backend API

## Backend API

This client is designed to work with the ASP.NET Core CRUD API:
https://github.com/mrhonek/dotnetcrud

## License

MIT
