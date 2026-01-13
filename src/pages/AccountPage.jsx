// src/pages/AccountPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/user.service';
import '../styles/account.css';

export default function AccountPage({ onNavigate }) {
  const navigate = useNavigate();
  const { user, userProfile, credits, signOut, refreshUser, updateProfile } = useAuth();
  const { t } = useI18n();
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditAvatar(user.avatar || '');
      
      // Check if this is a successful payment callback
      const params = new URLSearchParams(window.location.search);
      if (params.get('payment') === 'success') {
        setPaymentSuccess(true);
        refreshUser();
        // Clear the URL parameter
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [user, refreshUser]);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        setError(null);
        const usageData = await userService.getUsage();
        setUsage(usageData);
      } catch (err) {
        console.error('Error fetching usage:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUsage();
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      setError('Name cannot be empty');
      return;
    }

    try {
      setUpdating(true);
      setError(null);
      await updateProfile(editName, editAvatar);
      setSuccess('Profile updated successfully!');
      setEditMode(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (err) {
      setError('Failed to sign out');
    }
  };

  if (!user) {
    return (
      <div className="account-container min-h-screen flex flex-col items-center justify-center">
        <div className="not-authenticated">
          <h2>Please log in to view your account</h2>
          <p>Sign in with your Google or GitHub account to access your account settings and usage statistics.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="account-container">
        <div className="loading-spinner">Loading account information...</div>
      </div>
    );
  }

  const usagePercent = usage ? Math.min((usage.today / usage.limit) * 100, 100) : 0;
  const planLabel = user.plan.charAt(0).toUpperCase() + user.plan.slice(1);

  return (
    <div className="account-page bg-slate-50">
      {paymentSuccess && (
        <div className="success-banner">
          <p>✓ Your plan has been upgraded successfully! Thank you for your purchase.</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="success-message">
          <p>{success}</p>
        </div>
      )}

      <div className="account-grid">
        {/* Profile Section */}
        <section className="account-section profile-section">
          <h2>Profile Information</h2>
          
          {!editMode ? (
            <div className="profile-display">
              {user.avatar && (
                <div className="avatar">
                  <img src={user.avatar} alt={user.username} />
                </div>
              )}
              
              <div className="profile-info">
                <div className="info-item">
                  <label>Name</label>
                  <p>{user.name || 'Not set'}</p>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <p>{user.email}</p>
                </div>
                <div className="info-item">
                  <label>Member Since</label>
                  <p>{new Date(user?.createdAt || '').toLocaleDateString()}</p>
                </div>
              </div>

              <button className="btn-secondary" onClick={() => setEditMode(true)}>
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Your name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="avatar">Avatar URL</label>
                <input
                  id="avatar"
                  type="url"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                />
                {editAvatar && (
                  <div className="avatar-preview">
                    <img src={editAvatar} alt="Preview" />
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={updating}
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => {
                    setEditMode(false);
                    setEditName(user.name || '');
                    setEditAvatar(user.avatar || '');
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Plan Section */}
        <section className="account-section plan-section">
          <h2>Current Plan</h2>
          <div className="plan-info">
            <div className="flex w-full">
              <div className="plan-badge">{planLabel}</div>
            </div>
            
            <div className="plan-details">
              <div className="detail-item">
                <span className="label">Monthly Credits</span>
                <span className="value">{credits?.credits || 0}</span>
              </div>
              
              <div className="detail-item">
                <span className="label">Plan Type</span>
                <span className="value">{user.plan}</span>
              </div>

              {user?.subscriptionEndsAt && (
                <div className="detail-item">
                  <span className="label">Renews On</span>
                  <span className="value">
                    {new Date(user.subscriptionEndsAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <div className="form-actions">
              <button
                className="btn-primary"
                onClick={() => {
                  if (onNavigate) onNavigate('plans');
                  else navigate('/plans');
                }}
                style={{ cursor: 'pointer' }}
              >
                Upgrade or Change Plan
              </button>
              {user && (
                <button
                  className="btn-secondary ml-3"
                  onClick={() => navigate('/api-keys')}
                >
                  {t('header.nav.apiKeys') || t('apiKeys.title')}
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Usage Section */}
        <section className="account-section usage-section">
          <h2>Credit Usage</h2>
          {usage && (
            <div className="usage-stats">
              <div className="usage-item">
                <div className="usage-header">
                  <span className="usage-label">Today</span>
                  <span className="usage-value">{usage.today} / {usage.limit}</span>
                </div>
                <div className="usage-bar">
                  <div 
                    className="usage-fill" 
                    style={{ width: `${(usage.today / usage.limit) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="usage-item">
                <div className="usage-header">
                  <span className="usage-label">This Week</span>
                  <span className="usage-value">{usage.week}</span>
                </div>
                <p className="usage-note">Total credits used this week</p>
              </div>

              <div className="usage-item">
                <div className="usage-header">
                  <span className="usage-label">This Month</span>
                  <span className="usage-value">{usage.month}</span>
                </div>
                <p className="usage-note">Total credits used this month</p>
              </div>
            </div>
          )}
        </section>

        {/* Security Section */}
        <section className="account-section security-section">
          <h2>Security</h2>
          <div className="security-info">
            <p>Your password is managed by your authentication provider (Google/GitHub).</p>
            <p>To change your password or security settings, visit your provider's account settings.</p>
            
            <button className="border border-red-600 text-red-600 hover:text-red-800 font-semibold btn-danger" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
