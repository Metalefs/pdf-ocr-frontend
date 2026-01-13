import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/auth.service';
import { useI18n } from '../i18n';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ApiKeysPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKey, setNewKey] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) loadKeys();
  }, [user]);

  const loadKeys = async () => {
    try {
      const session = await supabase.auth.getSession();
      const res = await fetch(`${API_BASE}/api/ApiKeys`, {
        headers: {
          Authorization: `Bearer ${session.data.session.access_token}`
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setKeys(data);
      }
    } catch (err) {
      console.error('Erro ao carregar chaves:', err);
    } finally {
      setLoading(false);
    }
  };

  const createKey = async (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    setCreating(true);
    try {
      const session = await supabase.auth.getSession();
      const res = await fetch(`${API_BASE}/api/ApiKeys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.data.session.access_token}`
        },
        body: JSON.stringify({ 
          name: newKeyName,
          rateLimitPerMinute: 60
        })
      });

      if (res.ok) {
        const data = await res.json();
        setNewKey(data.plainKey); // Mostrar APENAS uma vez
        setNewKeyName('');
        await loadKeys();
      }
    } catch (err) {
      console.error('Erro ao criar chave:', err);
    } finally {
      setCreating(false);
    }
  };

  const revokeKey = async (keyId, keyName) => {
    if (!confirm(`Revogar chave "${keyName}"?`)) return;

    try {
      const session = await supabase.auth.getSession();
      const res = await fetch(`${API_BASE}/api/ApiKeys/${keyId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.data.session.access_token}`
        }
      });

      if (res.ok) {
        await loadKeys();
      }
    } catch (err) {
      console.error('Erro ao revogar:', err);
    }
  };

  const copyKey = () => {
    navigator.clipboard.writeText(newKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t('apiKeys.loginRequired')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{t('apiKeys.title')}</h1>
        <p className="text-slate-600 mb-8">{t('apiKeys.description')}</p>

        {/* Alerta de nova chave criada */}
        {newKey && (
          <div className="bg-amber-50 border-2 border-amber-500 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              ⚠️ {t('apiKeys.alertTitle')}
            </h3>
            <p className="text-sm text-slate-700 mb-4">{t('apiKeys.alertDescription')}</p>
            
            <div className="bg-white p-4 rounded border border-slate-200 font-mono text-sm break-all mb-4">
              {newKey}
            </div>

            <div className="flex gap-3">
              <button
                onClick={copyKey}
                className="bg-amber-600 text-white px-4 py-2 rounded font-semibold"
              >
                {copied ? t('apiKeys.copied') : `📋 ${t('apiKeys.copy')}`}
              </button>
              <button
                onClick={() => setNewKey(null)}
                className="border border-slate-300 px-4 py-2 rounded"
              >
                {t('apiKeys.okSaved')}
              </button>
            </div>
          </div>
        )}

        {/* Formulário de criação */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="font-semibold text-lg mb-4">{t('apiKeys.createTitle')}</h2>
          <form onSubmit={createKey} className="flex gap-3">
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder={t('apiKeys.createPlaceholder')}
              className="flex-1 border border-slate-300 rounded px-4 py-2"
            />
            <button
              type="submit"
              disabled={creating || !newKeyName.trim()}
              className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded font-semibold disabled:opacity-50"
            >
              {creating ? t('apiKeys.creating') : t('apiKeys.createButton')}
            </button>
          </form>
        </div>

        {/* Lista de chaves */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-slate-200">
            <h2 className="font-semibold text-lg">{t('apiKeys.activeKeys')}</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500">{t('apiKeys.loading')}</div>
          ) : keys.length === 0 ? (
            <div className="p-8 text-center text-slate-500">{t('apiKeys.noKeys')}</div>
          ) : (
            <div className="divide-y divide-slate-200">
              {keys.map((key) => (
                <div key={key.id} className="p-6 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{key.name}</h3>
                    <p className="text-sm text-slate-500">
                      Criada em {new Date(key.createdAt).toLocaleDateString()}
                      {key.lastUsedAt && ` • Último uso: ${new Date(key.lastUsedAt).toLocaleDateString()}`}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">sk_live_••••••••{key.id.toString().slice(-8)}</p>
                  </div>
                  <button
                    onClick={() => revokeKey(key.id, key.name)}
                    className="text-red-600 hover:text-red-800 font-medium text-sm"
                  >
                    {t('apiKeys.revoke')}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      <div className="mt-8 bg-slate-100 rounded-lg p-6">
        <h3 className="font-semibold mb-2">{t('apiKeys.howTo.title')}</h3>
        <p className="text-sm text-slate-600 mb-3">{t('apiKeys.howTo.authHeader')}</p>
        <pre className="bg-white p-4 rounded text-sm overflow-x-auto mb-3">{t('apiKeys.howTo.curlExample', { base: API_BASE })}</pre>
        <pre className="bg-white p-4 rounded text-sm overflow-x-auto">{t('apiKeys.howTo.jsExample', { base: API_BASE })}</pre>
      </div>
    </div>
  </div>
  );
}