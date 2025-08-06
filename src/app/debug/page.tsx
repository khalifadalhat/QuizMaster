"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getCategories, getQuestions, getAllUsers } from '@/service/firebase';
import { Category, Question, User } from '@/types';

export default function DebugPage() {
  const { user, isAdmin } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [categoriesData, questionsData, usersData] = await Promise.all([
        getCategories(),
        getQuestions(),
        getAllUsers()
      ]);
      
      setCategories(categoriesData);
      setQuestions(questionsData);
      setUsers(usersData);
      
      console.log('Debug - Data loaded:', {
        categories: categoriesData,
        questions: questionsData,
        users: usersData
      });
    } catch (error) {
      console.error('Error loading debug data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Database Debug Page
          </h1>
          
          <div className="mb-6">
            <button
              onClick={loadData}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh Data'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Categories */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Categories ({categories.length})
              </h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="text-sm">
                    <div className="font-medium">{category.name}</div>
                    <div className="text-gray-600 dark:text-gray-400">
                      Questions: {category.totalQuestions}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Questions */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Questions ({questions.length})
              </h2>
              <div className="space-y-2">
                {questions.slice(0, 10).map((question) => (
                  <div key={question.id} className="text-sm">
                    <div className="font-medium">{question.question.substring(0, 50)}...</div>
                    <div className="text-gray-600 dark:text-gray-400">
                      Category: {question.categoryId}
                    </div>
                  </div>
                ))}
                {questions.length > 10 && (
                  <div className="text-gray-500">... and {questions.length - 10} more</div>
                )}
              </div>
            </div>

            {/* Users */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Users ({users.length})
              </h2>
              <div className="space-y-2">
                {users.map((user) => (
                  <div key={user.uid} className="text-sm">
                    <div className="font-medium">{user.displayName}</div>
                    <div className="text-gray-600 dark:text-gray-400">
                      Role: {user.role} | Score: {user.totalScore}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Raw Data */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Raw Data
            </h2>
            <div className="bg-gray-100 dark:bg-gray-600 p-4 rounded text-xs overflow-auto max-h-96">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify({
                  categories: categories.length,
                  questions: questions.length,
                  users: users.length,
                  sampleCategory: categories[0],
                  sampleQuestion: questions[0],
                  sampleUser: users[0]
                }, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 