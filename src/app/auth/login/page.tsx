"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthForm } from '@/components/AuthForm';
import { motion } from 'framer-motion';
import { Shield, User } from 'lucide-react';

export default function LoginPage() {
  const [userType, setUserType] = useState<'user' | 'admin'>('user');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const router = useRouter();

  const handleToggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            QuizMaster
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your learning journey starts here
          </p>
        </motion.div>

        {/* User Type Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
            Choose your account type
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setUserType('user')}
              className={`p-4 rounded-lg border-2 transition-all ${
                userType === 'user'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <User className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Student
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Take quizzes & track progress
              </div>
            </button>
            
            <button
              onClick={() => setUserType('admin')}
              className={`p-4 rounded-lg border-2 transition-all ${
                userType === 'admin'
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <Shield className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Admin
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Manage content & users
              </div>
            </button>
          </div>
        </motion.div>

        {/* Auth Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AuthForm
            mode={mode}
            userType={userType}
            onToggleMode={handleToggleMode}
          />
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </div>
    </div>
  );
}