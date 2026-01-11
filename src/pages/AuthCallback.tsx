import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useAuth } from '../contexts/AuthContext';

/**
 * AuthCallback Page
 * Handles OAuth redirect from backend
 * Exchanges the OAuth code for a session
 */
export function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setIsLoading(true);

        // Get the OAuth code from URL params (sent by backend)
        const code = searchParams.get('code');
        const errorParam = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        // Handle OAuth errors
        if (errorParam) {
          const errorMsg = `OAuth Error: ${errorParam}. ${errorDescription || ''}`;
          setError(errorMsg);
          console.error('OAuth error:', errorMsg);
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 3000);
          return;
        }

        // No code received
        if (!code) {
          setError('No authorization code received from OAuth provider');
          console.error('Missing OAuth code in callback');
          
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 3000);
          return;
        }

        console.log('OAuth code received from backend, exchanging for session...');

        // Exchange the code for a session
        const success = await authService.exchangeCodeForSession(code);

        if (!success) {
          setError('Failed to establish session. Please try logging in again.');
          console.error('Code exchange failed');
          
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 3000);
          return;
        }

        console.log('Session established successfully');

        // Refresh user data to trigger AuthContext update
        await refreshUser();

        // Redirect to dashboard
        console.log('Redirecting to dashboard...');
        navigate('/dashboard', { replace: true });
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(`Authentication error: ${errorMsg}`);
        console.error('Auth callback error:', err);
        
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate, refreshUser]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Failed</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Authenticating...</h1>
        <p className="text-gray-600">Setting up your session. Please wait.</p>
      </div>
    </div>
  );
}

export default AuthCallback;
