"use client";

import React from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function TestPage() {
  const { user, loading, isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Authentication Test Page
        </h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Auth State:</h2>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded text-sm overflow-auto">
              {JSON.stringify({
                user: user ? {
                  uid: user.uid,
                  displayName: user.displayName,
                  email: user.email,
                  role: user.role
                } : null,
                loading,
                isAdmin
              }, null, 2)}
            </pre>
          </div>
          
          <div className="flex space-x-4">
            <a
              href="/dashboard"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Go to Dashboard
            </a>
            <a
              href="/admin"
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Go to Admin
            </a>
            <a
              href="/auth/login"
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Go to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 