# Hokie Nest Housing

A modern web application for finding and managing student housing near Virginia Tech. Built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🏠 Browse available properties
- 🔍 Advanced search and filtering
- 📝 Property reviews and ratings
- 💬 Contact landlords
- 👤 User authentication
- 📱 Responsive design
- ✨ Modern UI/UX

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hokie-nest-housing.git
   cd hokie-nest-housing
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run test` - Run tests
- `npm run coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/        # Reusable UI components
├── contexts/         # React context providers
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and configurations
├── pages/           # Page components
├── types/           # TypeScript type definitions
└── __tests__/       # Test files
```

## Testing

The project uses Vitest and React Testing Library for testing. Run the tests with:

```bash
npm run test
```

For test coverage report:

```bash
npm run coverage
```

## Database Schema

### Properties Table
- Properties available for rent
- Includes details like price, location, amenities

### Contact Inquiries Table
- Messages from users to landlords
- Tracks inquiry status

### Property Reviews Table
- User reviews and ratings
- Linked to properties
