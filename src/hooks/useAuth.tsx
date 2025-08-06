"use client";

import React, { useState, useEffect, useContext, createContext } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '@/libs/firebase';
import { createUser, getUser } from '@/service/firebase';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string, role?: 'user' | 'admin') => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingRole, setPendingRole] = useState<'user' | 'admin' | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      console.log('useAuth - Firebase user changed:', firebaseUser);
      
      if (firebaseUser) {
        console.log('useAuth - Getting user data for:', firebaseUser.uid);
        const userData = await getUser(firebaseUser.uid);
        console.log('useAuth - User data from Firestore:', userData);
        
        if (userData) {
          setUser(userData);
          console.log('useAuth - Set existing user:', userData);
        } else {
          console.log('useAuth - Creating new user');
          console.log('useAuth - Pending role:', pendingRole);
          
          const newUser: Omit<User, 'uid'> = {
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            role: pendingRole || 'user', // Use pending role if available, otherwise default to user
            createdAt: new Date().toISOString(),
            totalScore: 0,
            badges: [],
            completedQuizzes: []
          };
          await createUser(newUser, firebaseUser.uid);
          setUser({ uid: firebaseUser.uid, ...newUser });
          setPendingRole(null); // Clear pending role after use
          console.log('useAuth - Set new user:', { uid: firebaseUser.uid, ...newUser });
        }
      } else {
        console.log('useAuth - No Firebase user, setting user to null');
        setUser(null);
      }
      setLoading(false);
      console.log('useAuth - Set loading to false');
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Don't set loading to false here - let the onAuthStateChanged handle it
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (email: string, password: string, displayName: string, role: 'user' | 'admin' = 'user') => {
    setLoading(true);
    try {
      console.log('useAuth - Registering with role:', role);
      setPendingRole(role); // Set the pending role before creating the user
      
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      console.log('useAuth - Firebase user created:', firebaseUser.uid);
      
      // The onAuthStateChanged will handle creating the user document with the correct role
      // Don't set loading to false here - let the onAuthStateChanged handle it
    } catch (error) {
      setPendingRole(null); // Clear pending role on error
      setLoading(false);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Don't set loading to false here - let the onAuthStateChanged handle it
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    isAdmin: user?.role === 'admin'
  };

  console.log('useAuth - Context value:', {
    user: user?.displayName,
    loading,
    isAdmin: user?.role === 'admin',
    userRole: user?.role
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
