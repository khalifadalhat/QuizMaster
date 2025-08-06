"use client";

import React from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import AdminDashboard from '@/components/AdminDashboard';
import { useAuth } from '@/hooks/useAuth';

export default function AdminPage() {
  const { user, loading, isAdmin } = useAuth();

  // Debug logging
  console.log('Admin Page - User:', user);
  console.log('Admin Page - Loading:', loading);
  console.log('Admin Page - IsAdmin:', isAdmin);

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboard />
    </ProtectedRoute>
  );
} 