import { CustomQuestion } from "@/types";

// Open Trivia Database API
export const fetchOpenTriviaQuestions = async (
  category?: number,
  difficulty?: string,
  amount: number = 50
) => {
  try {
    let url = `https://opentdb.com/api.php?amount=${amount}&type=multiple`;

    if (category) url += `&category=${category}`;
    if (difficulty) url += `&difficulty=${difficulty}`;

    const response = await fetch(url);
    const data = await response.json();

    return data.results.map((q: {
      question: string;
      correct_answer: string;
      incorrect_answers: string[];
      difficulty: string;
      category: string;
    }) => ({
      question: decodeHtmlEntities(q.question),
      options: [...q.incorrect_answers, q.correct_answer]
        .map((opt) => decodeHtmlEntities(opt))
        .sort(() => Math.random() - 0.5), 
      correctAnswer: [...q.incorrect_answers, q.correct_answer]
        .map((opt) => decodeHtmlEntities(opt))
        .sort(() => Math.random() - 0.5)
        .indexOf(decodeHtmlEntities(q.correct_answer)),
      difficulty: q.difficulty as "easy" | "medium" | "hard",
      category: q.category,
    }));
  } catch (error) {
    console.error("Error fetching Open Trivia questions:", error);
    throw error;
  }
};

// Helper function to decode HTML entities
const decodeHtmlEntities = (text: string): string => {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
};

// STEM Questions Database
export const stemQuestions: CustomQuestion[] = [
  // Physics - Easy
  {
    question: "What is the speed of light in vacuum?",
    options: [
      "299,792,458 m/s",
      "300,000,000 m/s",
      "150,000,000 m/s",
      "200,000,000 m/s",
    ],
    correctAnswer: 0,
    difficulty: "easy",
    category: "Physics",
    explanation:
      "The speed of light in vacuum is exactly 299,792,458 meters per second.",
  },
  {
    question: "What force keeps planets in orbit around the Sun?",
    options: [
      "Gravitational force",
      "Electromagnetic force",
      "Nuclear force",
      "Friction force",
    ],
    correctAnswer: 0,
    difficulty: "easy",
    category: "Physics",
  },
  {
    question: "What is the basic unit of electric current?",
    options: ["Volt", "Ampere", "Ohm", "Watt"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "Physics",
  },

  // Chemistry - Easy
  {
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: 2,
    difficulty: "easy",
    category: "Chemistry",
  },
  {
    question: "How many protons does a hydrogen atom have?",
    options: ["0", "1", "2", "3"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "Chemistry",
  },
  {
    question: "What is the most abundant gas in Earth's atmosphere?",
    options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Argon"],
    correctAnswer: 2,
    difficulty: "easy",
    category: "Chemistry",
  },

  // Biology - Easy
  {
    question: "What is the powerhouse of the cell?",
    options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "Biology",
  },
  {
    question: "How many chambers does a human heart have?",
    options: ["2", "3", "4", "5"],
    correctAnswer: 2,
    difficulty: "easy",
    category: "Biology",
  },
  {
    question:
      "What gas do plants absorb from the atmosphere during photosynthesis?",
    options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
    correctAnswer: 2,
    difficulty: "easy",
    category: "Biology",
  },

  // Mathematics - Easy
  {
    question: "What is the value of π (pi) to two decimal places?",
    options: ["3.14", "3.15", "3.16", "3.13"],
    correctAnswer: 0,
    difficulty: "easy",
    category: "Mathematics",
  },
  {
    question: "What is 15% of 200?",
    options: ["25", "30", "35", "40"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "Mathematics",
  },

  // Add more STEM questions for medium and hard difficulties...
  // Physics - Medium
  {
    question: "What is Newton's second law of motion?",
    options: ["F = ma", "E = mc²", "V = IR", "P = IV"],
    correctAnswer: 0,
    difficulty: "medium",
    category: "Physics",
    explanation:
      "Newton's second law states that Force equals mass times acceleration (F = ma).",
  },
  {
    question:
      "What phenomenon describes the bending of light as it passes through different media?",
    options: ["Reflection", "Refraction", "Diffraction", "Interference"],
    correctAnswer: 1,
    difficulty: "medium",
    category: "Physics",
  },

  // Add more questions up to reach 100+ STEM questions...
];

// Programming Questions Database
export const programmingQuestions: CustomQuestion[] = [
  // JavaScript - Easy
  {
    question:
      "Which method is used to add an element to the end of an array in JavaScript?",
    options: ["append()", "push()", "add()", "insert()"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "JavaScript",
    explanation:
      "The push() method adds one or more elements to the end of an array.",
  },
  {
    question: "What does 'HTML' stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Home Tool Markup Language",
      "Hyperlink Text Management Language",
    ],
    correctAnswer: 0,
    difficulty: "easy",
    category: "Web Development",
  },
  {
    question: "Which of the following is NOT a programming language?",
    options: ["Python", "Java", "HTML", "C++"],
    correctAnswer: 2,
    difficulty: "easy",
    category: "General Programming",
    explanation: "HTML is a markup language, not a programming language.",
  },

  // Python - Easy
  {
    question: "Which function is used to output text in Python?",
    options: ["echo()", "print()", "output()", "display()"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "Python",
  },
  {
    question: "What is the correct file extension for Python files?",
    options: [".py", ".python", ".pt", ".pyt"],
    correctAnswer: 0,
    difficulty: "easy",
    category: "Python",
  },

  // Add more programming questions...
  // Medium difficulty
  {
    question:
      "What is the time complexity of searching in a balanced binary search tree?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: 1,
    difficulty: "medium",
    category: "Data Structures",
    explanation:
      "In a balanced BST, search operations take O(log n) time due to the tree's height.",
  },

  // Add more up to 80+ programming questions...
];

// General Knowledge Questions
export const generalKnowledgeQuestions: CustomQuestion[] = [
  {
    question: "What is the capital of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Perth"],
    correctAnswer: 2,
    difficulty: "easy",
    category: "Geography",
  },
  {
    question: "Who painted the Mona Lisa?",
    options: [
      "Vincent van Gogh",
      "Leonardo da Vinci",
      "Pablo Picasso",
      "Michelangelo",
    ],
    correctAnswer: 1,
    difficulty: "easy",
    category: "Art",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "Space",
  },
  {
    question: "What is the largest ocean on Earth?",
    options: [
      "Atlantic Ocean",
      "Indian Ocean",
      "Arctic Ocean",
      "Pacific Ocean",
    ],
    correctAnswer: 3,
    difficulty: "easy",
    category: "Geography",
  },
  {
    question: "In which year did World War II end?",
    options: ["1944", "1945", "1946", "1947"],
    correctAnswer: 1,
    difficulty: "medium",
    category: "History",
  },
  // Add more general knowledge questions...
];

// O-Level Questions (British/International curriculum)
export const oLevelQuestions: CustomQuestion[] = [
  // English
  {
    question:
      "Which literary device is used in 'The wind whispered through the trees'?",
    options: ["Metaphor", "Personification", "Simile", "Alliteration"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "English Literature",
  },
  {
    question: "What is the past participle of 'begin'?",
    options: ["began", "begun", "beginning", "begins"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "English Grammar",
  },

  // Mathematics
  {
    question: "What is the derivative of x²?",
    options: ["x", "2x", "x²", "2x²"],
    correctAnswer: 1,
    difficulty: "medium",
    category: "Mathematics",
  },
  {
    question: "What is the area of a circle with radius 5 units?",
    options: ["25π", "10π", "5π", "15π"],
    correctAnswer: 0,
    difficulty: "medium",
    category: "Mathematics",
  },
];

// Function to seed initial categories
export const seedCategories = async () => {
  const categories = [
    {
      name: "General Knowledge",
      description:
        "Test your knowledge across various topics including geography, history, and culture",
      icon: "🌍",
      color: "#3B82F6",
      totalQuestions: 0,
    },
    {
      name: "STEM",
      description:
        "Science, Technology, Engineering, and Mathematics questions",
      icon: "🔬",
      color: "#10B981",
      totalQuestions: 0,
    },
    {
      name: "Programming",
      description: "Computer programming and software development questions",
      icon: "💻",
      color: "#8B5CF6",
      totalQuestions: 0,
    },
    {
      name: "O-Level",
      description: "Questions based on O-Level curriculum subjects",
      icon: "📚",
      color: "#F59E0B",
      totalQuestions: 0,
    },
    {
      name: "Entertainment",
      description: "Movies, music, sports, and pop culture",
      icon: "🎭",
      color: "#EF4444",
      totalQuestions: 0,
    },
  ];

  return categories;
};

// Function to seed questions from APIs and custom databases
export const seedQuestions = async () => {
  try {
    const triviaQuestions = await fetchOpenTriviaQuestions();

    // Combine with custom questions
    const allQuestions = [
      ...stemQuestions,
      ...programmingQuestions,
      ...generalKnowledgeQuestions,
      ...oLevelQuestions,
    ];

    return { triviaQuestions, customQuestions: allQuestions };
  } catch (error) {
    console.error("Error seeding questions:", error);
    throw error;
  }
};

// Function to fetch questions by category from Open Trivia API
export const fetchQuestionsByCategory = async (
  category: string,
  difficulty: string = 'easy',
  amount: number = 10
) => {
  try {
    // Map category names to Open Trivia category IDs
    const categoryMap: { [key: string]: number } = {
      'General Knowledge': 9,
      'Books': 10,
      'Film': 11,
      'Music': 12,
      'Musicals & Theatres': 13,
      'Television': 14,
      'Video Games': 15,
      'Board Games': 16,
      'Science & Nature': 17,
      'Computers': 18,
      'Mathematics': 19,
      'Mythology': 20,
      'Sports': 21,
      'Geography': 22,
      'History': 23,
      'Politics': 24,
      'Art': 25,
      'Celebrities': 26,
      'Animals': 27,
      'Vehicles': 28,
      'Entertainment: Comics': 29,
      'Science: Gadgets': 30,
      'Entertainment: Japanese Anime & Manga': 31,
      'Entertainment: Cartoon & Animations': 32
    };

    const categoryId = categoryMap[category];
    if (!categoryId) {
      throw new Error(`Category "${category}" not found in Open Trivia API`);
    }

    const questions = await fetchOpenTriviaQuestions(categoryId, difficulty, amount);
    return questions;
  } catch (error) {
    console.error(`Error fetching questions for category "${category}":`, error);
    throw error;
  }
};

// Function to get all available categories from Open Trivia API
export const getAvailableTriviaCategories = () => {
  return [
    'General Knowledge',
    'Books',
    'Film',
    'Music',
    'Musicals & Theatres',
    'Television',
    'Video Games',
    'Board Games',
    'Science & Nature',
    'Computers',
    'Mathematics',
    'Mythology',
    'Sports',
    'Geography',
    'History',
    'Politics',
    'Art',
    'Celebrities',
    'Animals',
    'Vehicles',
    'Entertainment: Comics',
    'Science: Gadgets',
    'Entertainment: Japanese Anime & Manga',
    'Entertainment: Cartoon & Animations'
  ];
};
