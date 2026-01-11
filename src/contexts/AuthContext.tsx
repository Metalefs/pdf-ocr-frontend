// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, User, supabase } from '../services/auth.service';
import { userService, UserProfile, UserCredits } from '../services/user.service';
import { Session } from '@supabase/auth-js';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  credits: UserCredits | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (name: string, avatar?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async (session: Session | null) => {
      const fetchedUser = await authService.getUser(session);
      if (fetchedUser) {
        // authService.getUser already calls /api/auth/me; avoid duplicate calls to loadUserData
        setUser(fetchedUser);
        setUserProfile({
          id: fetchedUser.id,
          email: fetchedUser.email,
          name: fetchedUser.name,
          avatar: fetchedUser.avatar || null,
          credits: fetchedUser.credits || 0,
          plan: fetchedUser.plan || 'free'
        } as UserProfile);
        setCredits({ credits: fetchedUser.credits } as UserCredits);
      } else {
        setUser(null);
        setUserProfile(null);
        setCredits(null);
      }
    };
    initialize(null);
    // Listen for auth changes
    const subscription = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // syncWithBackend is guarded against duplicates (cached token)
        await authService.syncWithBackend(session.access_token);

        // Fetch user but reuse data returned to avoid calling /me twice
        const fetchedUser = await authService.getUser(session);
        if (fetchedUser) {
          setUser(fetchedUser);
          setUserProfile({
            id: fetchedUser.id,
            email: fetchedUser.email,
            name: fetchedUser.name,
            avatar: fetchedUser.avatar || null,
            credits: fetchedUser.credits || 0,
            plan: fetchedUser.plan || 'free'
          } as UserProfile);
          setCredits({ credits: fetchedUser.credits } as UserCredits);
        }
      }
      setLoading(false);
    });

    return () => {
      // Properly unsubscribe
      if (subscription && typeof subscription === 'object') {
        const { data } = subscription as any;
        if (data?.subscription?.unsubscribe) {
          data.subscription.unsubscribe();
        }
      }
    };
  }, []);

  /**
   * Load user profile and credits from backend
   */
  const loadUserData = async () => {
    try {
      const [profile, creditsData] = await Promise.all([
        userService.getProfile(),
        userService.getCredits(),
      ]);

      setUserProfile(profile);
      setCredits(creditsData);

      // Set user with merged data
      const userData: User = {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        avatar: profile.avatar,
        credits: profile.credits,
        plan: profile.plan,
      };
      setUser(userData);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  /**
   * Sign in with Google
   */
  const signInWithGoogle = async () => {
    try {
      await authService.signInWithGoogle();
    } catch (error) {
      console.error('Google sign-in failed:', error);
      throw error;
    }
  };

  /**
   * Sign in with GitHub
   */
  const signInWithGithub = async () => {
    try {
      await authService.signInWithGithub();
    } catch (error) {
      console.error('GitHub sign-in failed:', error);
      throw error;
    }
  };

  /**
   * Sign out the user
   */
  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setUserProfile(null);
      setCredits(null);
    } catch (error) {
      console.error('Sign-out failed:', error);
      throw error;
    }
  };

  /**
   * Refresh user data
   */
  const refreshUser = async () => {
    try {
      await loadUserData();
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  /**
   * Update user profile
   */
  const updateProfile = async (name: string, avatar?: string) => {
    try {
      const updated = await userService.updateProfile(name, avatar);
      setUserProfile(updated);
      if (user) {
        setUser({
          ...user,
          name: updated.name,
          avatar: updated.avatar,
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        credits,
        loading,
        signInWithGoogle,
        signInWithGithub,
        signOut,
        refreshUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}