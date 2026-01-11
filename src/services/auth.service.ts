// src/services/auth.service.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  credits: number;
  plan: 'free' | 'pro' | 'business';
}

// Determine environment and set appropriate redirect URLs
const getAuthRedirectUrl = (): string => {
  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (isDev) {
    // Local development: redirect to frontend on localhost:54336
    return 'http://localhost:54336/auth/callback';
  } else {
    // Production: redirect to frontend on Render
    return 'https://pdf-ocr-frontend.onrender.com/auth/callback';
  }
};

const getSupabaseBackendRedirectUrl = (): string => {
  // Always redirect to backend API, which will then redirect to frontend
  const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000';
  return `${apiUrl}/api/auth/callback`;
};

class AuthService {
  /**
   * Sign in with Google OAuth
   */
  async signInWithGoogle() {
    try {
      const redirectUrl = getSupabaseBackendRedirectUrl();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  }

  /**
   * Sign in with GitHub OAuth
   */
  async signInWithGithub() {
    try {
      const redirectUrl = getSupabaseBackendRedirectUrl();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: redirectUrl,
        },
      });
      debugger;
      console.log(data);
      navigator.clipboard.writeText(JSON.stringify(data));
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('GitHub sign-in error:', error);
      throw error;
    }
  }

  /**
   * Sign out the current user
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign-out error:', error);
      throw error;
    }
  }

  /**
   * Get current session
   */
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    } catch (error) {
      console.error('Get session error:', error);
      throw error;
    }
  }

  /**
   * Get current authenticated user from backend
   */
  async getUser(): Promise<User | null> {
    try {
      const session = await this.getSession();
      if (!session) return null;

      const apiUrl = (import.meta as any).env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/users/me`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid, sign out
          await this.signOut();
          return null;
        }
        console.error('Failed to fetch user:', response.statusText);
        return null;
      }

      return response.json();
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  /**
   * Listen for auth state changes
   */
  onAuthStateChange(callback: (user: User | null) => void) {
    try {
      return supabase.auth.onAuthStateChange(async (event, session) => {
        if (session && event !== 'SIGNED_OUT') {
          const user = await this.getUser();
          callback(user);
        } else {
          callback(null);
        }
      });
    } catch (error) {
      console.error('Auth state change listener error:', error);
      return { data: { subscription: { unsubscribe: () => {} } } } as any;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const session = await this.getSession();
      return !!session;
    } catch {
      return false;
    }
  }

  /**
   * Refresh user data from backend
   */
  async refreshUserData(): Promise<User | null> {
    return this.getUser();
  }

  /**
   * Get the appropriate redirect URL for current environment
   */
  getRedirectUrl(): string {
    return getAuthRedirectUrl();
  }

  /**
   * Get the backend callback URL for current environment
   */
  getBackendCallbackUrl(): string {
    return getSupabaseBackendRedirectUrl();
  }

  /**
   * Exchange OAuth code for session (called from callback page)
   * The backend has already exchanged the code with Supabase,
   * now we verify it on the backend and get user data
   */
  async exchangeCodeForSession(code: string): Promise<boolean> {
    try {
      // Store the code temporarily in localStorage
      localStorage.setItem('oauth_code', code);
      
      // Verify the code with the backend to get user data
      const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        console.error('Failed to exchange code for session:', response.statusText);
        return false;
      }

      // Clear the code after successful exchange
      localStorage.removeItem('oauth_code');
      return true;
    } catch (error) {
      console.error('Code exchange error:', error);
      return false;
    }
  }
}

export const authService = new AuthService();