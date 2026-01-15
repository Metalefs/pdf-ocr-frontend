// src/services/user.service.ts
import { supabase } from './auth.service';
import { withLanguageHeaders } from './api';

const API_BASE = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  credits: number;
  plan: 'free' | 'pro' | 'business';
  createdAt: string;
  subscriptionEndsAt?: string;
}

export interface UserCredits {
  credits: number;
  resetDate: string;
  plan: string;
}

export interface UserUsage {
  today: number;
  week: number;
  month: number;
  limit: number;
}

class UserService {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserProfile> {
    const session = await supabase.auth.getSession();
    if (!session.data.session) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE}/api/users/me`, {
      headers: withLanguageHeaders({
        headers: {
          Authorization: `Bearer ${session.data.session.access_token}`,
        },
      }).headers,
    });

    if (!response.ok) throw new Error('Failed to fetch user profile');
    return response.json();
  }

  /**
   * Get user credits and plan information
   */
  async getCredits(): Promise<UserCredits> {
    const session = await supabase.auth.getSession();
    if (!session.data.session) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE}/api/users/credits`, {
      headers: withLanguageHeaders({
        headers: {
          Authorization: `Bearer ${session.data.session.access_token}`,
        },
      }).headers,
    });

    if (!response.ok) throw new Error('Failed to fetch credits');
    return response.json();
  }

  /**
   * Get user usage statistics
   */
  async getUsage(): Promise<UserUsage> {
    const session = await supabase.auth.getSession();
    if (!session.data.session) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE}/api/users/usage`, {
      headers: withLanguageHeaders({
        headers: {
          Authorization: `Bearer ${session.data.session.access_token}`,
        },
      }).headers,
    });

    if (!response.ok) throw new Error('Failed to fetch usage');
    return response.json();
  }

  /**
   * Update user profile information
   */
  async updateProfile(name: string, avatar?: string): Promise<UserProfile> {
    const session = await supabase.auth.getSession();
    if (!session.data.session) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE}/api/users/me`, {
      method: 'PUT',
      headers: withLanguageHeaders({
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.data.session.access_token}`,
        },
      }).headers,
      body: JSON.stringify({ name, avatar }),
    });

    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  }
}

export const userService = new UserService();
