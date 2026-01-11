// src/pages/AuthCallbackPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/auth.service';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Supabase handles the OAuth redirect automatically
        // The session should be established in localStorage
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (data.session) {
          // Redirect to account page or home
          navigate('/account', { replace: true });
        } else {
          throw new Error('No session found');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err.message || 'Authentication failed');
        setLoading(false);
        
        // Redirect to home after 3 seconds
        setTimeout(() => navigate('/', { replace: true }), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f0f0f0',
          borderTop: '4px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p>Completing authentication...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <h2>Authentication Error</h2>
        <p>{error}</p>
        <p>Redirecting to home...</p>
      </div>
    );
  }

  return null;
}
