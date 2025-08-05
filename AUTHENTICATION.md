# QuizMaster Authentication System

## Overview

QuizMaster implements a comprehensive authentication system with role-based access control (RBAC) supporting both user and admin roles.

## Authentication Flow

### 1. Landing Page (`/`)
- Public access
- Provides options for user and admin registration/login
- Features showcase and platform information

### 2. Authentication Pages

#### Login Page (`/auth/login`)
- **Access**: Public
- **Features**:
  - Choose between User and Admin login
  - Email/password authentication
  - Google OAuth integration
  - Toggle between login and register modes
  - Responsive design with dark mode support

#### Register Page (`/auth/register`)
- **Access**: Public
- **Features**:
  - Choose account type (User/Admin)
  - Email/password registration
  - Google OAuth registration
  - Form validation
  - Back navigation to login

### 3. Protected Routes

#### User Dashboard (`/dashboard`)
- **Access**: Authenticated users only
- **Features**:
  - Quiz taking interface
  - Progress tracking
  - Leaderboard
  - Profile management
  - Dark mode toggle

#### Admin Dashboard (`/admin`)
- **Access**: Authenticated admins only
- **Features**:
  - Content management
  - User management
  - Analytics and reports
  - Quiz creation and editing
  - System settings

## Components

### AuthForm Component
Located at `src/components/AuthForm.tsx`
- Handles both login and registration
- Supports user and admin roles
- Google OAuth integration
- Form validation and error handling

### ProtectedRoute Component
Located at `src/components/ProtectedRoute.tsx`
- Role-based access control
- Automatic redirects based on authentication status
- Loading states during authentication checks

### Navigation Component
Located at `src/components/Navigation.tsx`
- Role-based navigation
- User profile display
- Logout functionality

## Authentication Hooks

### useAuth Hook
Located at `src/hooks/useAuth.tsx`
- Firebase authentication integration
- User state management
- Role-based access control
- Login/logout/register functions

## Firebase Integration

### Configuration
- Firebase Auth for authentication
- Firestore for user data storage
- Google OAuth provider

### User Data Structure
```typescript
interface User {
  uid: string;
  email: string;
  displayName: string;
  role: "user" | "admin";
  createdAt: string;
  totalScore: number;
  badges: string[];
  completedQuizzes: string[];
}
```

## Security Features

1. **Role-based Access Control**: Users can only access appropriate dashboards
2. **Protected Routes**: Automatic redirects for unauthenticated users
3. **Client-side Validation**: Form validation before submission
4. **Error Handling**: Comprehensive error messages for authentication failures
5. **Session Management**: Persistent authentication state

## Usage Examples

### Creating a Protected Route
```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function MyPage() {
  return (
    <ProtectedRoute allowedRoles={['user']}>
      <UserContent />
    </ProtectedRoute>
  );
}
```

### Using Authentication in Components
```tsx
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, isAdmin, logout } = useAuth();
  
  return (
    <div>
      <p>Welcome, {user?.displayName}</p>
      {isAdmin && <AdminPanel />}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Environment Variables

Required Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Getting Started

1. Set up Firebase project and add environment variables
2. Enable Email/Password and Google authentication in Firebase Console
3. Set up Firestore database with appropriate security rules
4. Run the development server: `npm run dev`
5. Navigate to `/auth/register` to create your first account

## File Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── admin/
│   │   └── page.tsx
│   └── page.tsx
├── components/
│   ├── AuthForm.tsx
│   ├── ProtectedRoute.tsx
│   ├── Navigation.tsx
│   ├── UserDashboard.tsx
│   └── AdminDashboard.tsx
├── hooks/
│   └── useAuth.tsx
└── libs/
    └── firebase.ts
``` 