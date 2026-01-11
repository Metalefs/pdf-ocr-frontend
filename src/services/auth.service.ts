import { createClient, Session } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;
const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000';

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
    const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000';
    return `${apiUrl}/api/auth/callback`;
};

class AuthService {
  /**
   * Sincroniza usuário com backend após login
   */
  // Cache last synced access token to avoid duplicate /sync requests
  private lastSyncedToken: string | null = null;
  private lastSyncedAt: number = 0;

  public async syncWithBackend(accessToken: string): Promise<void> {
    try {
      if (!accessToken) return;

      // If we've recently synced with the same token, skip the call
      const now = Date.now();
      if (this.lastSyncedToken === accessToken && (now - this.lastSyncedAt) < 30_000) {
        return;
      }

      const response = await fetch(`${apiUrl}/api/auth/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken }),
      });

      const responseData = await response.json().catch(() => null);
      if (responseData && responseData.user) {
        localStorage.setItem('user', JSON.stringify(responseData.user));
      }

      if (!response.ok) {
        console.error('Falha ao sincronizar com backend');
      } else {
        this.lastSyncedToken = accessToken;
        this.lastSyncedAt = now;
      }
    } catch (error) {
      console.error('Erro na sincronização:', error);
    }
  }

  /**
   * Login com Google OAuth
   */
  async signInWithGoogle() {
    try {
        const redirectUrl = getAuthRedirectUrl();
        const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro no login Google:', error);
      throw error;
    }
  }

  /**
   * Login com GitHub OAuth
   */
  async signInWithGithub() {
    try {
        const redirectUrl = getAuthRedirectUrl();
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro no login GitHub:', error);
      throw error;
    }
  }

  /**
   * Logout
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      localStorage.removeItem('user');
      if (error) throw error;
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    }
  }

  /**
   * Obtém sessão atual
   */
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      // Sincroniza com backend se houver sessão
      if (data.session) {
        await this.syncWithBackend(data.session.access_token);
      }
      
      return data.session;
    } catch (error) {
      console.error('Erro ao obter sessão:', error);
      return null;
    }
  }

  /**
   * Obtém dados do usuário
   */
  async getUser(session: Session | null = null): Promise<User | null> {
    try {
        session = session || await this.getSession();
        if (!session) return null;

        let supabaseUser = null;
        if(!session.user) supabaseUser = (await supabase.auth.getUser()).data.user;
        
        if (!supabaseUser && !session.user) return null;

        // Busca dados complementares do backend
        const response = await fetch(`${apiUrl}/api/auth/me`, {
            headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            // Fallback para dados do Supabase
            return {
            id: (supabaseUser || session.user).id,
            email: (supabaseUser || session.user).email || '',
            name: (supabaseUser || session.user).user_metadata?.full_name || 
                    (supabaseUser || session.user).user_metadata?.name || 
                    (supabaseUser || session.user).email?.split('@')[0] || 'Usuário',
            avatar: (supabaseUser || session.user).user_metadata?.avatar_url || 
                    (supabaseUser || session.user).user_metadata?.picture,
            credits: 2,
            plan: 'free'
            };
        }
        const data = await response.json();
        data.username = data.name.name; // Mapear name para username
        return {
            ...data,
            id: (supabaseUser || session.user).id,
            email: (supabaseUser || session.user).email || '',
            user: data.name,
            username: data.username || (supabaseUser || session.user).user_metadata?.full_name || 
                (supabaseUser || session.user).user_metadata?.name || 
                (supabaseUser || session.user).email?.split('@')[0] || 'Usuário',
            avatar: data.avatar || (supabaseUser || session.user).user_metadata?.avatar_url || 
                    (supabaseUser || session.user).user_metadata?.picture,
        };
    } catch (error) {
      console.error('Erro ao obter usuário:', error);
      return null;
    }
  }

  /**
   * Verifica se está autenticado
   */
  async isAuthenticated(): Promise<boolean> {
    const session = await this.getSession();
    return !!session;
  }

  /**
   * Atualiza dados do usuário
   */
  async refreshUserData(): Promise<User | null> {
    return this.getUser();
  }

  /**
   * Exchange OAuth code for session by calling backend and set Supabase session locally
   */
  async exchangeCodeForSession(code: string): Promise<boolean> {
    try {
      const resp = await fetch(`${apiUrl}/api/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      if (!resp.ok) {
        console.error('Backend failed to exchange code:', resp.statusText);
        return false;
      }

      const data = await resp.json();

      // Supabase token response includes access_token and refresh_token
      const accessToken = data?.access_token;
      const refreshToken = data?.refresh_token;

      if (!accessToken) {
        console.error('No access_token returned from backend');
        return false;
      }

      // Set Supabase session in the client
      const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
      if (error) {
        console.error('Failed to set Supabase session:', error);
        return false;
      }

      // Sync with backend explicitly
      await this.syncWithBackend(accessToken);

      return true;
    } catch (err) {
      console.error('exchangeCodeForSession error:', err);
      return false;
    }
  }
}

export const authService = new AuthService();