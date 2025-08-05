# Questions Integration Guide

## Overview

This guide explains how to integrate your predefined questions from `questionsApis.ts` with the QuizMaster application.

## Available Question Sources

### 1. Predefined Questions (Local)
Your `questionsApis.ts` file contains several question databases:

- **STEM Questions** (`stemQuestions`): Science, Technology, Engineering, Mathematics
- **Programming Questions** (`programmingQuestions`): Computer programming and development
- **General Knowledge Questions** (`generalKnowledgeQuestions`): Geography, history, art, culture
- **O-Level Questions** (`oLevelQuestions`): British/International curriculum

### 2. External API Questions
- **Open Trivia Database**: Fetches questions from opentdb.com API
- **Categories Available**: 24 different categories including Science, History, Entertainment, etc.

## How to Add Your Questions to the Database

### Method 1: Using the Admin Setup Page (Recommended)

1. **Login as Admin**
   - Register/login with admin role
   - Navigate to `/admin/setup`

2. **Setup Database**
   - Click "Check Database Stats" to see current data
   - Click "Setup Database" to populate with your questions
   - This will create categories and add all your predefined questions

3. **Verify Setup**
   - Check the database statistics
   - Verify questions are properly categorized

### Method 2: Programmatic Setup

```typescript
import { seedDatabaseWithQuestions } from '@/utils/seedDatabase';

// In your admin component
const setupQuestions = async () => {
  const result = await seedDatabaseWithQuestions(userId);
  console.log(`Created ${result.categories} categories and ${result.questions} questions`);
};
```

## Question Categories Created

When you run the setup, the following categories will be created:

1. **STEM** 🔬
   - Questions: Physics, Chemistry, Biology, Mathematics
   - Difficulty: Easy to Medium
   - Color: Green (#10B981)

2. **Programming** 💻
   - Questions: JavaScript, Python, Web Development, Data Structures
   - Difficulty: Easy to Medium
   - Color: Purple (#8B5CF6)

3. **General Knowledge** 🌍
   - Questions: Geography, History, Art, Culture + Trivia API
   - Difficulty: Easy to Medium
   - Color: Blue (#3B82F6)

4. **O-Level** 📚
   - Questions: English, Mathematics, Literature
   - Difficulty: Easy to Medium
   - Color: Orange (#F59E0B)

## Adding New Questions

### 1. Add to Existing Categories

Edit `questionsApis.ts` and add questions to the appropriate arrays:

```typescript
// Add to STEM questions
export const stemQuestions: CustomQuestion[] = [
  // ... existing questions
  {
    question: "Your new question here?",
    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
    correctAnswer: 0, // Index of correct answer
    difficulty: "easy", // or "medium", "hard"
    category: "Physics",
    explanation: "Optional explanation"
  }
];
```

### 2. Create New Categories

1. **Add questions to a new array:**
```typescript
export const newCategoryQuestions: CustomQuestion[] = [
  // Your questions here
];
```

2. **Update the seedDatabaseWithQuestions function:**
```typescript
// In seedDatabase.ts
if (categoryIds['Your Category Name']) {
  for (const question of newCategoryQuestions) {
    // ... create question logic
  }
}
```

### 3. Add External API Questions

Use the provided functions to fetch questions from Open Trivia API:

```typescript
import { fetchQuestionsByCategory, getAvailableTriviaCategories } from '@/utils/questionsApis';

// Get available categories
const categories = getAvailableTriviaCategories();

// Fetch questions for a specific category
const questions = await fetchQuestionsByCategory('Science & Nature', 'easy', 10);
```

## Question Format

All questions must follow the `CustomQuestion` interface:

```typescript
interface CustomQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option (0-3)
  difficulty: "easy" | "medium" | "hard";
  category: string;
  explanation?: string; // Optional explanation
}
```

## Points System

Questions are automatically assigned points based on difficulty:
- **Easy**: 10 points
- **Medium**: 15 points
- **Hard**: 20 points

## Testing Your Questions

### 1. Setup Database
```bash
# Login as admin and visit
http://localhost:3000/admin/setup
```

### 2. Test as User
```bash
# Register as user and visit
http://localhost:3000/dashboard
```

### 3. Take a Quiz
- Go to "Categories" tab
- Click "Start Quiz" on any category
- Verify questions appear correctly

## Troubleshooting

### No Questions Appearing
1. Check if database was seeded properly
2. Visit `/admin/setup` and click "Check Database Stats"
3. Verify categories exist in Firebase

### Questions Not Loading
1. Check browser console for errors
2. Verify Firebase configuration
3. Check network connectivity for API calls

### Role Issues
1. Ensure you're logged in as admin for setup
2. Check user role in `/test` page
3. Verify role was saved correctly during registration

## API Integration

### Open Trivia Database
The system automatically fetches additional questions from:
- **URL**: https://opentdb.com/api.php
- **Categories**: 24 available categories
- **Limits**: 20 questions per category to avoid rate limits

### Custom API Integration
To add your own API:

1. **Create fetch function:**
```typescript
export const fetchYourApiQuestions = async () => {
  const response = await fetch('your-api-endpoint');
  const data = await response.json();
  return data.map(transformToCustomQuestion);
};
```

2. **Add to seedDatabaseWithQuestions:**
```typescript
// In seedDatabase.ts
const yourQuestions = await fetchYourApiQuestions();
// Add to database logic
```

## Best Practices

1. **Question Quality**: Ensure questions are clear and accurate
2. **Answer Options**: Make all options plausible
3. **Difficulty Balance**: Mix easy, medium, and hard questions
4. **Category Organization**: Group related questions together
5. **Regular Updates**: Add new questions periodically

## Monitoring

Use the admin dashboard to monitor:
- Total questions per category
- User performance statistics
- Popular categories
- Question effectiveness

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify Firebase configuration
3. Test with the `/test` page
4. Review the authentication flow 