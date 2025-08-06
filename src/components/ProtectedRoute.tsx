"use client";

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('user' | 'admin')[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = ['user', 'admin'],
  redirectTo = '/auth/login'
}) => {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    console.log('ProtectedRoute - User:', user);
    console.log('ProtectedRoute - Loading:', loading);
    console.log('ProtectedRoute - IsAdmin:', isAdmin);
    console.log('ProtectedRoute - AllowedRoles:', allowedRoles);
    
    if (!loading) {
      if (!user) {
        console.log('ProtectedRoute - No user, redirecting to:', redirectTo);
        router.push(redirectTo);
      } else if (allowedRoles.length > 0) {
        const userRole = isAdmin ? 'admin' : 'user';
        console.log('ProtectedRoute - User role:', userRole);
        if (!allowedRoles.includes(userRole as 'user' | 'admin')) {
          console.log('ProtectedRoute - Role not allowed, redirecting');
          if (isAdmin) {
            router.push('/admin');
          } else {
            router.push('/dashboard');
          }
        } else {
          console.log('ProtectedRoute - Access granted');
        }
      }
    }
  }, [user, loading, isAdmin, allowedRoles, redirectTo, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  const userRole = isAdmin ? 'admin' : 'user';
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole as 'user' | 'admin')) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}; 