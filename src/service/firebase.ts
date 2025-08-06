import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  writeBatch,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { User, Category, Question, Quiz, Badge, UserProgress } from "@/types";
import { firestore } from "@/libs/firebase";

// User Management
export const createUser = async (userData: Omit<User, "uid">, uid?: string) => {
  try {
    if (uid) {
      // Use the provided UID (from Firebase Auth)
      await setDoc(doc(firestore, "users", uid), {
        ...userData,
        createdAt: serverTimestamp(),
        totalScore: 0,
        badges: [],
        completedQuizzes: [],
      });
      return uid;
    } else {
      // Use auto-generated ID
      const docRef = await addDoc(collection(firestore, "users"), {
        ...userData,
        createdAt: serverTimestamp(),
        totalScore: 0,
        badges: [],
        completedQuizzes: [],
      });
      return docRef.id;
    }
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const getUser = async (uid: string): Promise<User | null> => {
  try {
    const docRef = doc(firestore, "users", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? ({ uid, ...docSnap.data() } as User) : null;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

export const updateUser = async (uid: string, updates: Partial<User>) => {
  try {
    const docRef = doc(firestore, "users", uid);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Category Management
export const createCategory = async (categoryData: Omit<Category, "id">) => {
  try {
    const docRef = await addDoc(collection(firestore, "categories"), {
      ...categoryData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    const q = query(collection(firestore, "categories"), orderBy("name"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Category[];
  } catch (error) {
    console.error("Error getting categories:", error);
    throw error;
  }
};

export const updateCategory = async (
  id: string,
  updates: Partial<Category>
) => {
  try {
    const docRef = doc(firestore, "categories", id);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const deleteCategory = async (id: string) => {
  try {
    // Delete all questions in this category first
    const questionsQuery = query(
      collection(firestore, "questions"),
      where("categoryId", "==", id)
    );
    const questionsSnapshot = await getDocs(questionsQuery);

    const batch = writeBatch(firestore);
    questionsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Delete the category
    batch.delete(doc(firestore, "categories", id));
    await batch.commit();
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

// Question Management
export const createQuestion = async (questionData: Omit<Question, "id">) => {
  try {
    const docRef = await addDoc(collection(firestore, "questions"), {
      ...questionData,
      createdAt: serverTimestamp(),
    });

    // Update category question count
    const categoryRef = doc(firestore, "categories", questionData.categoryId);
    await updateDoc(categoryRef, {
      totalQuestions: increment(1),
    });

    console.log(`Created question with ID: ${docRef.id} for category: ${questionData.categoryId}`);
    return docRef.id;
  } catch (error) {
    console.error("Error creating question:", error);
    throw error;
  }
};

export const getQuestions = async (
  categoryId?: string,
  difficulty?: string,
  limitCount?: number
): Promise<Question[]> => {
  try {
    let q = query(collection(firestore, "questions"));

    if (categoryId) {
      q = query(q, where("categoryId", "==", categoryId));
    }

    if (difficulty) {
      q = query(q, where("difficulty", "==", difficulty));
    }

    if (limitCount) {
      q = query(q, limit(limitCount));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Question[];
  } catch (error) {
    console.error("Error getting questions:", error);
    throw error;
  }
};

export const updateQuestion = async (
  id: string,
  updates: Partial<Question>
) => {
  try {
    const docRef = doc(firestore, "questions", id);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error("Error updating question:", error);
    throw error;
  }
};

export const deleteQuestion = async (id: string, categoryId: string) => {
  try {
    const batch = writeBatch(firestore);

    // Delete the question
    batch.delete(doc(firestore, "questions", id));

    // Update category question count
    const categoryRef = doc(firestore, "categories", categoryId);
    batch.update(categoryRef, {
      totalQuestions: increment(-1),
    });

    await batch.commit();
  } catch (error) {
    console.error("Error deleting question:", error);
    throw error;
  }
};

// Quiz Management
export const saveQuizResult = async (quizData: Omit<Quiz, "id">) => {
  try {
    const batch = writeBatch(firestore);

    // Save quiz result
    const quizRef = doc(collection(firestore, "quizzes"));
    batch.set(quizRef, {
      ...quizData,
      completedAt: serverTimestamp(),
    });

    // Update user total score
    const userRef = doc(firestore, "users", quizData.userId);
    batch.update(userRef, {
      totalScore: increment(quizData.score),
      completedQuizzes: increment(1),
    });

    // Update user progress
    const progressRef = doc(
      firestore,
      "userProgress",
      `${quizData.userId}_${quizData.categoryId}`
    );
    batch.set(
      progressRef,
      {
        userId: quizData.userId,
        categoryId: quizData.categoryId,
        questionsAnswered: increment(quizData.totalQuestions),
        correctAnswers: increment(quizData.score / 10), // assuming 10 points per correct answer
        lastAttempt: serverTimestamp(),
      },
      { merge: true }
    );

    await batch.commit();
    return quizRef.id;
  } catch (error) {
    console.error("Error saving quiz result:", error);
    throw error;
  }
};

// Get all users (for admin dashboard)
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const q = query(collection(firestore, "users"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    })) as User[];
  } catch (error) {
    console.error("Error getting all users:", error);
    throw error;
  }
};

// Leaderboard
export const getLeaderboard = async (
  limitCount: number = 10
): Promise<User[]> => {
  try {
    const q = query(
      collection(firestore, "users"),
      where("role", "==", "user"),
      orderBy("totalScore", "desc"),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    })) as User[];
  } catch (error: unknown) {
    // If the index doesn't exist, fall back to client-side filtering
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('index') || errorMessage.includes('failed-precondition')) {
      console.log('Leaderboard index not found, using client-side filtering');
      try {
        const q = query(
          collection(firestore, "users"),
          limit(100) 
        );
        const querySnapshot = await getDocs(q);
        const allUsers = querySnapshot.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        })) as User[];
        
        // Filter and sort client-side
        return allUsers
          .filter(user => user.role === 'user')
          .sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0))
          .slice(0, limitCount);
      } catch (fallbackError) {
        console.error("Error with fallback leaderboard query:", fallbackError);
        return [];
      }
    } else {
      console.error("Error getting leaderboard:", error);
      throw error;
    }
  }
};

// User Progress
export const getUserProgress = async (
  userId: string
): Promise<UserProgress[]> => {
  try {
    const q = query(
      collection(firestore, "userProgress"),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data()) as UserProgress[];
  } catch (error) {
    console.error("Error getting user progress:", error);
    throw error;
  }
};

// Badges
export const checkAndAwardBadges = async (
  userId: string,
  categoryId: string,
  score: number
) => {
  try {
    const user = await getUser(userId);
    if (!user) return;

    const badges = await getDocs(collection(firestore, "badges"));
    const newBadges: string[] = [];

    badges.forEach((badgeDoc) => {
      const badge = badgeDoc.data() as Badge;
      const badgeId = badgeDoc.id;

      // Skip if user already has this badge
      if (user.badges.includes(badgeId)) return;

      // Check badge requirements
      if (
        badge.requirement.type === "score" &&
        score >= badge.requirement.value
      ) {
        newBadges.push(badgeId);
      } else if (
        badge.requirement.type === "category_complete" &&
        badge.requirement.categoryId === categoryId
      ) {
        // Check if user completed all questions in category (this would need additional logic)
        // For now, award if score is high enough
        if (score >= badge.requirement.value) {
          newBadges.push(badgeId);
        }
      }
    });

    if (newBadges.length > 0) {
      await updateUser(userId, {
        badges: [...user.badges, ...newBadges],
      });
    }

    return newBadges;
  } catch (error) {
    console.error("Error checking badges:", error);
    throw error;
  }
};
