import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Target, 
  Star, 
  Award, 
  TrendingUp, 
  Users,
  BookOpen,
  Play,
  Settings,
  Moon,
  Sun
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { 
  getCategories, 
  getQuestions, 
  getUserProgress, 
  getLeaderboard,
  saveQuizResult
} from '@/service/firebase';
import { Category, Question, UserProgress, User } from '@/types';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [quizSettings, setQuizSettings] = useState({
    difficulty: 'easy',
    questionCount: 10
  });

  useEffect(() => {
    loadDashboardData();
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const loadDashboardData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const [categoriesData, progressData, leaderboardData] = await Promise.all([
        getCategories(),
        getUserProgress(user.uid),
        getLeaderboard(10)
      ]);
      
      setCategories(categoriesData);
      setUserProgress(progressData);
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const startQuiz = (category: Category) => {
    setSelectedCategory(category);
    setActiveTab('quiz');
  };

  const getUserRank = () => {
    const userIndex = leaderboard.findIndex(u => u.uid === user?.uid);
    return userIndex === -1 ? 'N/A' : `#${userIndex + 1}`;
  };

  const getProgressPercentage = (categoryId: string) => {
    const progress = userProgress.find(p => p.categoryId === categoryId);
    const category = categories.find(c => c.id === categoryId);
    if (!progress || !category || category.totalQuestions === 0) return 0;
    return Math.round((progress.questionsAnswered / category.totalQuestions) * 100);
  };

  const getBadgeCount = () => {
    return user?.badges?.length || 0;
  };

  // Calculate stats for charts
  const progressChartData = categories.map(category => ({
    name: category.name,
    progress: getProgressPercentage(category.id),
    answered: userProgress.find(p => p.categoryId === category.id)?.questionsAnswered || 0,
    total: category.totalQuestions
  }));

  const pieChartData = categories.map(category => {
    const progress = userProgress.find(p => p.categoryId === category.id);
    return {
      name: category.name,
      value: progress?.correctAnswers || 0,
      color: category.color
    };
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.displayName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Welcome back, {user?.displayName}!
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ready for your next challenge?
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <nav className="mb-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <Target className="w-4 h-4" /> },
              { id: 'categories', label: 'Categories', icon: <BookOpen className="w-4 h-4" /> },
              { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-4 h-4" /> },
              { id: 'profile', label: 'Profile', icon: <Settings className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <DashboardTab 
              user={user}
              userProgress={userProgress}
              categories={categories}
              leaderboard={leaderboard}
              progressChartData={progressChartData}
              pieChartData={pieChartData}
              getUserRank={getUserRank}
              getBadgeCount={getBadgeCount}
            />
          )}
          {activeTab === 'categories' && (
            <CategoriesTab
              categories={categories}
              userProgress={userProgress}
              onStartQuiz={startQuiz}
              getProgressPercentage={getProgressPercentage}
            />
          )}
          {activeTab === 'leaderboard' && (
            <LeaderboardTab leaderboard={leaderboard} currentUser={user} />
          )}
          {activeTab === 'profile' && (
            <ProfileTab user={user} getBadgeCount={getBadgeCount} />
          )}
          {activeTab === 'quiz' && selectedCategory && (
            <QuizTab
              category={selectedCategory}
              quizSettings={quizSettings}
              onBack={() => setActiveTab('categories')}
              onComplete={() => {
                setActiveTab('dashboard');
                loadDashboardData();
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

interface DashboardTabProps {
  user: User | null;
  userProgress: UserProgress[];
  categories: Category[];
  leaderboard: User[];
  progressChartData: Array<{
    name: string;
    progress: number;
    answered: number;
    total: number;
  }>;
  pieChartData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  getUserRank: () => string;
  getBadgeCount: () => number;
}

const DashboardTab = ({ 
  user, 
  userProgress, 
  categories, 
  leaderboard, 
  progressChartData, 
  pieChartData, 
  getUserRank, 
  getBadgeCount 
}: DashboardTabProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="space-y-8"
  >
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatsCard
        title="Total Score"
        value={user?.totalScore || 0}
        icon={<Star className="w-6 h-6" />}
        color="bg-yellow-500"
        suffix="pts"
      />
      <StatsCard
        title="Rank"
        value={getUserRank()}
        icon={<Trophy className="w-6 h-6" />}
        color="bg-blue-500"
      />
      <StatsCard
        title="Badges Earned"
        value={getBadgeCount()}
        icon={<Award className="w-6 h-6" />}
        color="bg-purple-500"
      />
      <StatsCard
        title="Categories"
        value={`${userProgress.length}/${categories.length}`}
        icon={<BookOpen className="w-6 h-6" />}
        color="bg-green-500"
      />
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Progress Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Progress by Category
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={progressChartData}>
            <CartesianGrid strokeDasharray="3 3" className="dark:opacity-30" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              className="dark:text-gray-300"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              className="dark:text-gray-300"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--tooltip-bg)',
                border: 'var(--tooltip-border)',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="progress" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Correct Answers Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {pieChartData.map((entry, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Recent Activity & Quick Actions */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="space-y-3">
          {categories.slice(0, 3).map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{category.icon}</span>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {category.totalQuestions} questions available
                    </p>
                  </div>
                </div>
                <Play className="w-5 h-5 text-blue-500" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Top Performers
        </h3>
        <div className="space-y-3">
          {leaderboard.slice(0, 5).map((player: User, index: number) => (
            <div
              key={player.uid}
              className={`flex items-center justify-between p-3 rounded-lg ${
                player.uid === user?.uid 
                  ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                  : 'bg-gray-50 dark:bg-gray-700'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3 ${
                  index === 0 ? 'bg-yellow-500 text-white' :
                  index === 1 ? 'bg-gray-400 text-white' :
                  index === 2 ? 'bg-orange-500 text-white' :
                  'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {player.displayName}
                    {player.uid === user?.uid && <span className="text-blue-600 ml-2">(You)</span>}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {player.badges.length} badges
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">{player.totalScore}</p>
                <p className="text-xs text-gray-500">points</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  suffix?: string;
}

const StatsCard = ({ title, value, icon, color, suffix = '' }: StatsCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
  >
    <div className="flex items-center">
      <div className={`${color} text-white p-3 rounded-lg mr-4`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}{suffix}
        </p>
      </div>
    </div>
  </motion.div>
);

interface CategoriesTabProps {
  categories: Category[];
  userProgress: UserProgress[];
  onStartQuiz: (category: Category) => void;
  getProgressPercentage: (categoryId: string) => number;
}

const CategoriesTab = ({ categories, userProgress, onStartQuiz, getProgressPercentage }: CategoriesTabProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Quiz Categories
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Choose a category to start your quiz journey
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category: Category) => {
        const progress = getProgressPercentage(category.id);
        const userCategoryProgress = userProgress.find((p: UserProgress) => p.categoryId === category.id);
        
        return (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-3xl mr-3">{category.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {category.totalQuestions} questions
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{progress}%</div>
                  <div className="text-xs text-gray-500">completed</div>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {category.description}
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-2 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
              </div>

              {/* Stats */}
              {userCategoryProgress && (
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <span>Answered: {userCategoryProgress.questionsAnswered}</span>
                  <span>Correct: {userCategoryProgress.correctAnswers}</span>
                  <span>Avg: {Math.round(userCategoryProgress.averageScore)}%</span>
                </div>
              )}

              <button
                onClick={() => onStartQuiz(category)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Quiz
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  </motion.div>
);

interface LeaderboardTabProps {
  leaderboard: User[];
  currentUser: User | null;
}

const LeaderboardTab = ({ leaderboard, currentUser }: LeaderboardTabProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Leaderboard
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        See how you rank against other players
      </p>
    </div>

    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {/* Top 3 Podium */}
      <div className="p-6 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600">
        <div className="flex justify-center items-end space-x-8">
          {leaderboard.slice(0, 3).map((user: User, index: number) => (
            <motion.div
              key={user.uid}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`text-center ${index === 0 ? 'order-2' : index === 1 ? 'order-1' : 'order-3'}`}
            >
              <div className={`w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl font-bold text-white ${
                index === 0 ? 'bg-yellow-600 h-20 w-20' :
                index === 1 ? 'bg-gray-500' :
                'bg-orange-500'
              }`}>
                {user.displayName.charAt(0).toUpperCase()}
              </div>
              <div className={`bg-white rounded-lg p-3 ${
                index === 0 ? 'transform scale-110' : ''
              }`}>
                <h3 className="font-bold text-gray-900">{user.displayName}</h3>
                <p className="text-2xl font-bold text-yellow-600">{user.totalScore}</p>
                <p className="text-sm text-gray-600">{user.badges.length} badges</p>
              </div>
              <div className={`mt-2 font-bold text-white ${
                index === 0 ? 'text-2xl' : 'text-xl'
              }`}>
                #{index + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Rest of the leaderboard */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {leaderboard.slice(3).map((user: User, index: number) => (
          <div
            key={user.uid}
            className={`p-4 flex items-center justify-between ${
              user.uid === currentUser?.uid 
                ? 'bg-blue-50 dark:bg-blue-900/20' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center font-bold text-sm mr-4">
                {index + 4}
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                {user.displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {user.displayName}
                  {user.uid === currentUser?.uid && (
                    <span className="text-blue-600 ml-2">(You)</span>
                  )}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user.badges.length} badges earned
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-green-600">{user.totalScore}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">points</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

interface ProfileTabProps {
  user: User | null;
  getBadgeCount: () => number;
}

const ProfileTab = ({ user, getBadgeCount }: ProfileTabProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="max-w-2xl mx-auto"
  >
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold mb-4">
          {user?.displayName?.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {user?.displayName}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-3xl font-bold text-blue-600">{user?.totalScore || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Points</div>
        </div>
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-3xl font-bold text-purple-600">{getBadgeCount()}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Badges Earned</div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2" />
          Your Badges
        </h3>
        {getBadgeCount() === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No badges earned yet. Start taking quizzes to earn your first badge!</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {user?.badges?.map((badgeId: string) => (
              <div key={badgeId} className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-3xl mb-2">🏆</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Badge {badgeId}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Account Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Account Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Email Notifications</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Receive updates about new quizzes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Public Profile</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Show your progress on leaderboard</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

interface QuizTabProps {
  category: Category;
  quizSettings: {
    difficulty: string;
    questionCount: number;
  };
  onBack: () => void;
  onComplete: () => void;
}

const QuizTab = ({ category, quizSettings, onBack, onComplete }: QuizTabProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadQuestions();
  }, []);

  // Timer effect
  useEffect(() => {
    if (quizStarted && !quizCompleted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !quizCompleted) {
      handleQuizComplete();
    }
  }, [timeLeft, quizStarted, quizCompleted]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const questionsData = await getQuestions(
        category.id,
        quizSettings.difficulty,
        quizSettings.questionCount
      );
      
      console.log('QuizTab - Loaded questions:', {
        categoryId: category.id,
        difficulty: quizSettings.difficulty,
        requestedCount: quizSettings.questionCount,
        actualCount: questionsData.length,
        questions: questionsData
      });
      
      // Shuffle questions
      const shuffledQuestions = questionsData.sort(() => Math.random() - 0.5);
      const finalQuestions = shuffledQuestions.slice(0, quizSettings.questionCount);
      
      if (finalQuestions.length === 0) {
        console.warn('QuizTab - No questions available for category:', category.id);
      }
      
      setQuestions(finalQuestions);
      setSelectedAnswers(new Array(finalQuestions.length).fill(-1));
    } catch (error) {
      console.error('Error loading questions:', error);
      setQuestions([]);
      setSelectedAnswers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleQuizComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuizComplete = async () => {
    setQuizCompleted(true);
    
    // Calculate score
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const finalScore = correctAnswers * 10; // 10 points per correct answer
    setScore(finalScore);
    
    // Save quiz result
    if (user) {
      try {
        await saveQuizResult({
          userId: user.uid,
          categoryId: category.id,
          questions,
          userAnswers: selectedAnswers,
          score: finalScore,
          totalQuestions: questions.length,
          difficulty: quizSettings.difficulty as 'easy' | 'medium' | 'hard',
          timeSpent: 300 - timeLeft
        });
      } catch (error) {
        console.error('Error saving quiz result:', error);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-8"
      >
        <div className="text-center mb-8">
          <span className="text-6xl mb-4 block">{category.icon}</span>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {category.name} Quiz
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {category.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{questions.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Questions</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-green-600">5:00</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Time Limit</div>
          </div>
        </div>

        {questions.length === 0 ? (
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">❓</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Questions Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              There are no questions available for this category at the moment.
            </p>
          </div>
        ) : null}

        <div className="flex space-x-4">
          <button
            onClick={onBack}
            className="flex-1 py-3 px-6 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Back to Categories
          </button>
          <button
            onClick={() => setQuizStarted(true)}
            disabled={questions.length === 0}
            className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {questions.length === 0 ? 'No Questions' : 'Start Quiz'}
          </button>
        </div>
      </motion.div>
    );
  }

  if (quizCompleted) {
    const percentage = Math.round((score / (questions.length * 10)) * 100);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-8"
      >
        <div className="text-center mb-8">
          <div className={`text-6xl mb-4 ${percentage >= 80 ? '🎉' : percentage >= 60 ? '👏' : '💪'}`}>
            {percentage >= 80 ? '🎉' : percentage >= 60 ? '👏' : '💪'}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Quiz Completed!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {percentage >= 80 ? 'Excellent work!' : percentage >= 60 ? 'Good job!' : 'Keep practicing!'}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{score}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Points Earned</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{percentage}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{formatTime(300 - timeLeft)}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Time Taken</div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={onBack}
            className="flex-1 py-3 px-6 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Back to Categories
          </button>
          <button
            onClick={onComplete}
            className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            View Dashboard
          </button>
        </div>
      </motion.div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  
  // Handle case where no questions are loaded
  if (!currentQuestion) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <div className="text-6xl mb-4">❓</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No Questions Available
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            There are no questions available for this category. Please try another category or contact an administrator.
          </p>
          <button
            onClick={onBack}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Back to Categories
          </button>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      {/* Quiz Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <span className="text-2xl mr-3">{category.icon}</span>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {category.name} Quiz
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${timeLeft < 60 ? 'text-red-600' : 'text-blue-600'}`}>
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Time Left</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            className="bg-blue-600 h-2 rounded-full"
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          {currentQuestion.question}
        </h3>

        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                selectedAnswers[currentQuestionIndex] === index
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                  selectedAnswers[currentQuestionIndex] === index
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {selectedAnswers[currentQuestionIndex] === index && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span className="text-gray-900 dark:text-white">{option}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="py-3 px-6 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={selectedAnswers[currentQuestionIndex] === -1}
          className="py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next'}
        </button>
      </div>
    </motion.div>
  );
};

export default UserDashboard;