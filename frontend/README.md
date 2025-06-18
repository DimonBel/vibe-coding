# Task Management Frontend

A modern Next.js frontend application for managing tasks with AI integration, built with shadcn/ui components.

## Features

- **Task Management**: Create, edit, delete, and view tasks
- **User Management**: Create and manage users
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Real-time Updates**: Automatic refresh after operations
- **Form Validation**: Client-side validation with Zod
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern component library
- **React Hook Form**: Form management
- **Zod**: Schema validation
- **Axios**: HTTP client for API calls
- **date-fns**: Date formatting utilities

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Backend Integration

This frontend connects to a Flask backend API. Make sure your backend server is running on `http://localhost:5000` before using the frontend.

### API Endpoints

The frontend uses the following backend endpoints:

- `GET /tasks` - Get all tasks
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task
- `GET /users` - Get all users
- `POST /users` - Create a new user

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Main dashboard page
├── components/         # React components
│   ├── ui/            # shadcn/ui components
│   ├── TaskDialog.tsx # Task creation/editing dialog
│   ├── TaskList.tsx   # Task list component
│   └── UserManagement.tsx # User management component
└── lib/               # Utility functions
    ├── api.ts         # API service layer
    └── utils.ts       # Utility functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

No environment variables are required for basic functionality. The API base URL is configured in `src/lib/api.ts` and defaults to `http://localhost:5000`.
