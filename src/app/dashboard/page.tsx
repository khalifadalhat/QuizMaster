"use client";

import React from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import UserDashboard from '@/components/UserDashboard';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user, loading, isAdmin } = useAuth();

  // Debug logging
  console.log('Dashboard Page - User:', user);
  console.log('Dashboard Page - Loading:', loading);
  console.log('Dashboard Page - IsAdmin:', isAdmin);

  return (
    <ProtectedRoute allowedRoles={['user']}>
      <UserDashboard />
    </ProtectedRoute>
  );
}
