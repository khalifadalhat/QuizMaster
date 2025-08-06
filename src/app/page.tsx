"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, User, BookOpen, Trophy, Target, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  const features = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Interactive Quizzes",
      description: "Engage with dynamic questions across various subjects"
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Track Progress",
      description: "Monitor your learning journey with detailed analytics"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Personalized Learning",
      description: "Adaptive content based on your performance"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                QuizMaster
              </span>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/auth/login"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Master Your Knowledge
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              With QuizMaster
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto"
          >
            Transform your learning experience with interactive quizzes, real-time progress tracking, 
            and personalized content designed to help you succeed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/auth/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              Start Learning
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Learn More
            </button>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose QuizMaster?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our platform offers everything you need to enhance your learning experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* User Types Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Path
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Whether you're a student looking to learn or an educator managing content, 
            we have the perfect solution for you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Student Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                For Students
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Take quizzes, track progress, and earn badges
              </p>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                Access to diverse quiz categories
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                Real-time progress tracking
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                Personalized learning recommendations
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                Earn badges and achievements
              </li>
            </ul>

            <Link
              href="/auth/register"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              Start Learning
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>

          {/* Admin Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                For Administrators
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Manage content, users, and analytics
              </p>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
                Create and manage quiz content
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
                Monitor user progress and analytics
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
                Manage user accounts and permissions
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
                Generate detailed reports
              </li>
            </ul>

            <Link
              href="/auth/register"
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
            >
              Admin Portal
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                QuizMaster
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Empowering learners through interactive education
            </p>
            <div className="flex justify-center space-x-6">
              <Link
                href="/auth/login"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
