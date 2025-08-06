"use client";

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { 
  seedDatabaseWithQuestions,
  getQuestionStats,
  fixCategoryQuestionCounts
} from '@/utils/seedDatabase';
import { getCategories, getQuestions } from '@/service/firebase';
import { 
  stemQuestions, 
  programmingQuestions, 
  generalKnowledgeQuestions, 
  oLevelQuestions 
} from '@/utils/questionsApis';
import { motion } from 'framer-motion';
import { 
  Database, 
  BookOpen, 
  Users, 
  BarChart3, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function SetupPage() {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [stats, setStats] = useState<any>(null);

  const questionCategories = [
    {
      name: 'STEM',
      description: 'Science, Technology, Engineering, and Mathematics',
      icon: '🔬',
      color: '#10B981',
      questions: stemQuestions.length,
      difficulty: 'Easy to Medium'
    },
    {
      name: 'Programming',
      description: 'Computer programming and software development',
      icon: '💻',
      color: '#8B5CF6',
      questions: programmingQuestions.length,
      difficulty: 'Easy to Medium'
    },
    {
      name: 'General Knowledge',
      description: 'Geography, history, art, and culture',
      icon: '🌍',
      color: '#3B82F6',
      questions: generalKnowledgeQuestions.length + 20, // +20 for trivia API
      difficulty: 'Easy to Medium'
    },
    {
      name: 'O-Level',
      description: 'British/International curriculum subjects',
      icon: '📚',
      color: '#F59E0B',
      questions: oLevelQuestions.length,
      difficulty: 'Easy to Medium'
    }
  ];

  const setupDatabase = async () => {
    if (!isAdmin || !user) {
      setMessage('Only admins can set up the database');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('Setting up database with your predefined questions...');
    setMessageType('info');

    try {
      const result = await seedDatabaseWithQuestions(user.uid);
      
      setMessage(`Database setup completed! Created ${result.categories} categories and ${result.questions} questions.`);
      setMessageType('success');
      
      // Get updated stats
      await checkDatabaseStats();
      
    } catch (error) {
      console.error('Error setting up database:', error);
      setMessage('Error setting up database. Check console for details.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const checkDatabaseStats = async () => {
    setLoading(true);
    try {
      const stats = await getQuestionStats();
      setStats(stats);
      setMessage(`Found ${stats.totalCategories} categories and ${stats.totalQuestions} questions in the database.`);
      setMessageType('info');
    } catch (error) {
      console.error('Error checking stats:', error);
      setMessage('Error checking database stats.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const fixCategoryCounts = async () => {
    setLoading(true);
    try {
      await fixCategoryQuestionCounts();
      setMessage('Category question counts have been fixed!');
      setMessageType('success');
      await checkDatabaseStats(); // Refresh stats
    } catch (error) {
      console.error('Error fixing category counts:', error);
      setMessage('Error fixing category counts.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const clearMessage = () => {
    setMessage('');
    setMessageType('info');
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            <div className="flex items-center space-x-3 mb-6">
              <Database className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Database Setup
              </h1>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This page helps you populate the database with your predefined questions from the questionsApis.ts file.
            </p>
            
            <div className="flex space-x-4 mb-6">
              <button
                onClick={checkDatabaseStats}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Check Database Stats
              </button>
              
              <button
                onClick={setupDatabase}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 flex items-center"
              >
                <Database className="w-4 h-4 mr-2" />
                Setup Database
              </button>

              <button
                onClick={fixCategoryCounts}
                disabled={loading}
                className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:opacity-50 flex items-center"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Fix Category Counts
              </button>
            </div>

            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg mb-6 flex items-center ${
                  messageType === 'success' 
                    ? 'bg-green-100 border border-green-400 text-green-700' 
                    : messageType === 'error'
                    ? 'bg-red-100 border border-red-400 text-red-700'
                    : 'bg-blue-100 border border-blue-400 text-blue-700'
                }`}
              >
                {messageType === 'success' ? (
                  <CheckCircle className="w-5 h-5 mr-2" />
                ) : messageType === 'error' ? (
                  <AlertCircle className="w-5 h-5 mr-2" />
                ) : (
                  <BookOpen className="w-5 h-5 mr-2" />
                )}
                {message}
                <button
                  onClick={clearMessage}
                  className="ml-auto text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </motion.div>
            )}

            {/* Question Categories Overview */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Available Question Categories
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {questionCategories.map((category, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                  >
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-3">{category.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {category.questions} questions
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {category.description}
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      Difficulty: {category.difficulty}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Database Stats */}
            {stats && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Database Statistics
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalCategories}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.totalQuestions}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Questions</div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {Object.keys(stats.questionsByCategory).length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Active Categories</div>
                  </div>
                </div>

                {stats.questionsByCategory && Object.keys(stats.questionsByCategory).length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-2">
                      Questions by Category:
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {Object.entries(stats.questionsByCategory).map(([category, count]) => (
                        <div key={category} className="bg-gray-100 dark:bg-gray-600 p-2 rounded text-sm">
                          <span className="font-medium">{category}:</span> {count} questions
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Instructions */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                Instructions:
              </h3>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>• Click "Check Database Stats" to see current data</li>
                <li>• Click "Setup Database" to populate with your predefined questions</li>
                <li>• Questions will be automatically categorized and assigned difficulty levels</li>
                <li>• Additional trivia questions will be fetched from Open Trivia API</li>
                <li>• After setup, users can start taking quizzes immediately</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 