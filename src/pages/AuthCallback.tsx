import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService, supabase } from '../services/auth.service';
import { useAuth } from '../contexts/AuthContext';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handle = async () => {
      try {
        // search if url has content after # http://localhost:54336/auth/callback#access_token=eyJhbGciOiJFUzI1NiIsImtpZCI6ImY1ZDc3NjdjLWE1NGItNDczYy1iZjhhLTU1YzEzNzNiMzZiNSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3FkcHpxb2Zkdm9hbXljZHVvZHp5LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI4NWIwYWQxNS00OGUwLTRjMzQtODY2ZC03Njg3NWE1M2FhOWUiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzY4MTY4NTMzLCJpYXQiOjE3NjgxNjQ5MzMsImVtYWlsIjoiamFja3Nvbi5waXJlcy5ybUBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImdpdGh1YiIsInByb3ZpZGVycyI6WyJnaXRodWIiLCJnb29nbGUiXX0sInVzZXJfbWV0YWRhdGEiOnsiYXZhdGFyX3VybCI6Imh0dHBzOi8vYXZhdGFycy5naXRodWJ1c2VyY29udGVudC5jb20vdS80MDg5MzIwND92PTQiLCJlbWFpbCI6ImphY2tzb24ucGlyZXMucm1AZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZ1bGxfbmFtZSI6IlJhbWFsaG8gSmFja3NvbiIsImlzcyI6Imh0dHBzOi8vYXBpLmdpdGh1Yi5jb20iLCJuYW1lIjoiUmFtYWxobyBKYWNrc29uIiwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jTE9wbEdnR2dSYzdFVTF5SDM0bVJNazJCQU5PeWUzcVRGZ0ZSQmxlajhaZjVDWkktcXg9czk2LWMiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJNZXRhbGVmcyIsInByb3ZpZGVyX2lkIjoiNDA4OTMyMDQiLCJzdWIiOiI0MDg5MzIwNCIsInVzZXJfbmFtZSI6Ik1ldGFsZWZzIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib2F1dGgiLCJ0aW1lc3RhbXAiOjE3NjgxNjQ5MzN9XSwic2Vzc2lvbl9pZCI6ImIwZmRjOWFiLWQzNjAtNDVkOS1iZDNmLTYwNjQ4OTk4YjllZiIsImlzX2Fub255bW91cyI6ZmFsc2V9.3CiSgg0VxV1MQtrpj99C9FM2X8mxiRsdDDrTaPphowRhFphmntV4WS44QFKrZlJWW57AWt8c4rqMMhhCyP71kg&expires_at=1768168533&expires_in=3600&provider_token=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&refresh_token=d5xnfhppnddj&token_type=bearer

        if(window.location.hash){
            const hash = window.location.hash.substring(1);
            const params = new URLSearchParams(hash);
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');
            const err = params.get('error');
            const errDesc = params.get('error_description');
            if (err) {
              setError(`OAuth Error: ${err}. ${errDesc || ''}`);
              setTimeout(() => navigate('/account'), 3000);
              return;
            }
    
            if (!accessToken) {
              setError('No authorization code received');
              setTimeout(() => navigate('/home'), 3000);
              return;
            }
        }

        await refreshUser();
        navigate('/account', { replace: true });
      } catch (ex) {
        setError((ex as Error).message || 'Authentication error');
        setTimeout(() => navigate('/home'), 3000);
      }
    };

    handle();
  }, [searchParams, navigate, refreshUser]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Erro na Autenticação
          </h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <p className="text-sm text-slate-500">
            Redirecionando para página inicial...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 text-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex items-center justify-center gap-2 mt-6">
        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
}