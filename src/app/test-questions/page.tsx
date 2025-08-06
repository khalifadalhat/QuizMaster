"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getCategories, getQuestions } from '@/service/firebase';
import { Category, Question } from '@/types';

export default function TestQuestionsPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [questionsByCategory, setQuestionsByCategory] = useState<{ [key: string]: Question[] }>({});
  const [loading, setLoading] = useState(false);

  const loadQuestionsForAllCategories = async () => {
    setLoading(true);
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
      
      const questionsMap: { [key: string]: Question[] } = {};
      
      for (const category of categoriesData) {
        console.log(`Loading questions for category: ${category.name} (${category.id})`);
        const questions = await getQuestions(category.id);
        questionsMap[category.id] = questions;
        console.log(`Found ${questions.length} questions for ${category.name}`);
      }
      
      setQuestionsByCategory(questionsMap);
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestionsForAllCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Questions Test Page
          </h1>
          
          <div className="mb-6">
            <button
              onClick={loadQuestionsForAllCategories}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh Questions'}
            </button>
          </div>

          <div className="space-y-6">
            {categories.map((category) => {
              const questions = questionsByCategory[category.id] || [];
              return (
                <div key={category.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{category.icon}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Category ID: {category.id}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{questions.length}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Questions</div>
                    </div>
                  </div>
                  
                  {questions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <div className="text-4xl mb-2">❓</div>
                      <p>No questions found for this category</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {questions.slice(0, 3).map((question, index) => (
                        <div key={question.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                          <div className="font-medium text-gray-900 dark:text-white mb-2">
                            Q{index + 1}: {question.question.substring(0, 100)}...
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Difficulty: {question.difficulty} | Points: {question.points}
                          </div>
                        </div>
                      ))}
                      {questions.length > 3 && (
                        <div className="text-center text-gray-500 dark:text-gray-400">
                          ... and {questions.length - 3} more questions
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {Object.values(questionsByCategory).reduce((sum, questions) => sum + questions.length, 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Questions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {Object.values(questionsByCategory).filter(questions => questions.length > 0).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Categories with Questions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {Object.values(questionsByCategory).filter(questions => questions.length === 0).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Empty Categories</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 