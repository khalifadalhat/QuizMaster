import { 
  seedCategories, 
  seedQuestions, 
  stemQuestions, 
  programmingQuestions, 
  generalKnowledgeQuestions, 
  oLevelQuestions 
} from './questionsApis';
import { 
  createCategory, 
  createQuestion, 
  getCategories, 
  getQuestions 
} from '@/service/firebase';
import { Category, Question } from '@/types';

// Helper function to remove undefined fields from objects
const removeUndefinedFields = (obj: any): any => {
  const cleaned = { ...obj };
  Object.keys(cleaned).forEach(key => {
    if (cleaned[key] === undefined) {
      delete cleaned[key];
    }
  });
  return cleaned;
};

export const seedDatabaseWithQuestions = async (userId: string) => {
  try {
    console.log('Starting database seeding...');

    // First, create categories
    const categoryData = await seedCategories();
    const categoryIds: { [key: string]: string } = {};

    console.log('Creating categories...');
    for (const category of categoryData) {
      const categoryId = await createCategory(category);
      categoryIds[category.name] = categoryId;
      console.log(`Created category: ${category.name} with ID: ${categoryId}`);
    }

    // Create questions for each category
    console.log('Creating questions...');

    // STEM Questions
    if (categoryIds['STEM']) {
      for (const question of stemQuestions) {
        const questionData: Omit<Question, 'id'> = removeUndefinedFields({
          categoryId: categoryIds['STEM'],
          question: question.question,
          options: question.options,
          correctAnswer: question.correctAnswer,
          difficulty: question.difficulty,
          points: question.difficulty === 'easy' ? 10 : question.difficulty === 'medium' ? 15 : 20,
          explanation: question.explanation,
          createdAt: new Date().toISOString(),
          createdBy: userId
        });
        await createQuestion(questionData);
      }
      console.log(`Created ${stemQuestions.length} STEM questions`);
    }

    // Programming Questions
    if (categoryIds['Programming']) {
      for (const question of programmingQuestions) {
        const questionData: Omit<Question, 'id'> = removeUndefinedFields({
          categoryId: categoryIds['Programming'],
          question: question.question,
          options: question.options,
          correctAnswer: question.correctAnswer,
          difficulty: question.difficulty,
          points: question.difficulty === 'easy' ? 10 : question.difficulty === 'medium' ? 15 : 20,
          explanation: question.explanation,
          createdAt: new Date().toISOString(),
          createdBy: userId
        });
        await createQuestion(questionData);
      }
      console.log(`Created ${programmingQuestions.length} Programming questions`);
    }

    // General Knowledge Questions
    if (categoryIds['General Knowledge']) {
      for (const question of generalKnowledgeQuestions) {
        const questionData: Omit<Question, 'id'> = removeUndefinedFields({
          categoryId: categoryIds['General Knowledge'],
          question: question.question,
          options: question.options,
          correctAnswer: question.correctAnswer,
          difficulty: question.difficulty,
          points: question.difficulty === 'easy' ? 10 : question.difficulty === 'medium' ? 15 : 20,
          explanation: question.explanation,
          createdAt: new Date().toISOString(),
          createdBy: userId
        });
        await createQuestion(questionData);
      }
      console.log(`Created ${generalKnowledgeQuestions.length} General Knowledge questions`);
    }

    // O-Level Questions
    if (categoryIds['O-Level']) {
      for (const question of oLevelQuestions) {
        const questionData: Omit<Question, 'id'> = removeUndefinedFields({
          categoryId: categoryIds['O-Level'],
          question: question.question,
          options: question.options,
          correctAnswer: question.correctAnswer,
          difficulty: question.difficulty,
          points: question.difficulty === 'easy' ? 10 : question.difficulty === 'medium' ? 15 : 20,
          explanation: question.explanation,
          createdAt: new Date().toISOString(),
          createdBy: userId
        });
        await createQuestion(questionData);
      }
      console.log(`Created ${oLevelQuestions.length} O-Level questions`);
    }

    // Try to fetch additional questions from Open Trivia API
    try {
      console.log('Fetching additional questions from Open Trivia API...');
      const { triviaQuestions } = await seedQuestions();
      
      // Add some trivia questions to General Knowledge category
      if (categoryIds['General Knowledge'] && triviaQuestions.length > 0) {
        const questionsToAdd = triviaQuestions.slice(0, 20); // Limit to 20 questions
        
        for (const question of questionsToAdd) {
          const questionData: Omit<Question, 'id'> = removeUndefinedFields({
            categoryId: categoryIds['General Knowledge'],
            question: question.question,
            options: question.options,
            correctAnswer: question.correctAnswer,
            difficulty: question.difficulty,
            points: question.difficulty === 'easy' ? 10 : question.difficulty === 'medium' ? 15 : 20,
            createdAt: new Date().toISOString(),
            createdBy: userId
          });
          await createQuestion(questionData);
        }
        console.log(`Added ${questionsToAdd.length} trivia questions to General Knowledge`);
      }
    } catch (error) {
      console.log('Could not fetch trivia questions:', error);
    }

    console.log('Database seeding completed successfully!');
    
    // Return summary
    const finalCategories = await getCategories();
    const finalQuestions = await getQuestions();
    
    return {
      categories: finalCategories.length,
      questions: finalQuestions.length,
      summary: {
        'STEM': stemQuestions.length,
        'Programming': programmingQuestions.length,
        'General Knowledge': generalKnowledgeQuestions.length + 20, // +20 for trivia
        'O-Level': oLevelQuestions.length
      }
    };

  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

export const getQuestionStats = async () => {
  try {
    const categories = await getCategories();
    const questions = await getQuestions();
    
    const stats = {
      totalCategories: categories.length,
      totalQuestions: questions.length,
      questionsByCategory: {} as { [key: string]: number }
    };

    // Count questions by category
    for (const category of categories) {
      const categoryQuestions = questions.filter(q => q.categoryId === category.id);
      stats.questionsByCategory[category.name] = categoryQuestions.length;
    }

    return stats;
  } catch (error) {
    console.error('Error getting question stats:', error);
    throw error;
  }
};

// Function to fix category question counts
export const fixCategoryQuestionCounts = async () => {
  try {
    const categories = await getCategories();
    const questions = await getQuestions();
    
    const batch = writeBatch(firestore);
    
    for (const category of categories) {
      const categoryQuestions = questions.filter(q => q.categoryId === category.id);
      const actualCount = categoryQuestions.length;
      
      if (category.totalQuestions !== actualCount) {
        console.log(`Fixing category ${category.name}: ${category.totalQuestions} -> ${actualCount}`);
        const categoryRef = doc(firestore, "categories", category.id);
        batch.update(categoryRef, {
          totalQuestions: actualCount
        });
      }
    }
    
    await batch.commit();
    console.log('Category question counts fixed');
  } catch (error) {
    console.error('Error fixing category question counts:', error);
    throw error;
  }
}; 