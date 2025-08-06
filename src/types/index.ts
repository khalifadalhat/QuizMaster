export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: "user" | "admin";
  createdAt: string;
  totalScore: number;
  badges: string[];
  completedQuizzes: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  totalQuestions: number;
  createdAt: string;
}

export interface Question {
  id: string;
  categoryId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: "easy" | "medium" | "hard";
  points: number;
  explanation?: string;
  createdAt: string;
  createdBy: string;
}

export interface Quiz {
  id: string;
  userId: string;
  categoryId: string;
  questions: Question[];
  userAnswers: number[];
  score: number;
  totalQuestions: number;
  difficulty: "easy" | "medium" | "hard";
  completedAt: string;
  timeSpent: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirement: {
    type: "score" | "category_complete" | "streak";
    value: number;
    categoryId?: string;
  };
}

export interface UserProgress {
  userId: string;
  categoryId: string;
  questionsAnswered: number;
  correctAnswers: number;
  averageScore: number;
  lastAttempt: string;
  streak: number;
}

// Firestore Collections Structure:
/*
  users/{userId}
  categories/{categoryId}
  questions/{questionId}
  quizzes/{quizId}
  badges/{badgeId}
  userProgress/{userId}_{categoryId}
  leaderboard/{userId} // denormalized for quick access
  */

// API Response Types
export interface QuizAPIResponse {
  questions: {
    category: string;
    type: string;
    difficulty: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
  }[];
}

export interface CustomQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  explanation?: string;
}
