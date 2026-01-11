import React, { useState } from "react";
import { useI18n } from "../i18n";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header({ currentPage = "home", onNavigate }) {
  const { t, locale, setLocale } = useI18n();
  const { user, credits, loading, signInWithGoogle, signInWithGithub, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
      if (onNavigate) onNavigate("home");
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo & Brand */}
        <div 
          className="flex items-center gap-4 cursor-pointer" 
          onClick={() => onNavigate && onNavigate("home")}
        >
          <div className="text-2xl font-bold text-slate-800">
            {t("header.brand")}
          </div>
          <div className="text-sm text-slate-500 hidden md:block">
            {t("header.subtitle")}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            className="md:hidden mr-2 p-2 rounded-md text-slate-600 hover:bg-slate-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-4">
            {/* Menu Links */}
            <button
              onClick={() => { if (onNavigate) onNavigate('home'); navigate('/'); setMobileOpen(false); }}
              className={`text-sm font-medium transition ${
                currentPath === '/' || currentPath === '/home'
                  ? "text-sky-600"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              Home
            </button>
          
            <button
              onClick={() => { if (onNavigate) onNavigate('plans'); navigate('/plans'); setMobileOpen(false); }}
              className={`text-sm font-medium transition ${
                currentPath === '/plans'
                  ? "text-sky-600"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              Plans
            </button>

            {user && (
              <button
                onClick={() => { if (onNavigate) onNavigate('account'); navigate('/account'); setMobileOpen(false); }}
                className={`text-sm font-medium transition ${
                  currentPath === '/account'
                    ? "text-sky-600"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                Account
              </button>
            )}
          </div>

          {/* Mobile menu (small screens) */}
          {mobileOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-slate-100 py-4 shadow-md z-50">
              <div className="flex flex-col items-start px-6 gap-3">
                <button onClick={() => { if (onNavigate) onNavigate('home'); navigate('/'); setMobileOpen(false); }} className="w-full text-left">Home</button>
                <button onClick={() => { if (onNavigate) onNavigate('plans'); navigate('/plans'); setMobileOpen(false); }} className="w-full text-left">Plans</button>
                {user && <button onClick={() => { if (onNavigate) onNavigate('account'); navigate('/account'); setMobileOpen(false); }} className="w-full text-left">Account</button>}
              </div>
            </div>
          )}

          {/* Auth Section */}
          <div className="ml-2 flex items-center gap-3 relative">
            {loading ? (
              <div className="text-sm text-slate-500">Loading...</div>
            ) : user ? (
              <>
                {/* Credits Badge */}
                {credits && (
                  <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                    <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-semibold text-indigo-700">
                      {credits.credits}
                    </span>
                  </div>
                )}

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 transition"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full border-2 border-indigo-100"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                        {user.name?.at(0)?.toUpperCase()}
                      </div>
                    )}
                    <div className="hidden md:block text-left">
                      <div username="text-sm font-medium text-slate-700">
                        {user.name}
                      </div>
                      <div className="text-xs text-slate-500 capitalize">
                        {user.plan}
                      </div>
                    </div>
                    <svg 
                      className={`w-4 h-4 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <>
                      {/* Backdrop para fechar ao clicar fora */}
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowUserMenu(false)}
                      />
                      
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-20">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-slate-100">
                          <div className="text-sm font-medium text-slate-900">
                            {user.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {user.email}
                          </div>
                        </div>

                        {/* Credits */}
                        <div className="px-4 py-3 border-b border-slate-100">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Credits</span>
                            <span className="text-sm font-semibold text-indigo-600">
                              {credits?.credits || 0}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-slate-500">Plan</span>
                            <span className="text-xs font-medium text-slate-700 capitalize">
                              {user.plan}
                            </span>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            navigate('/account');
                            if (onNavigate) onNavigate("account");
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          My Account
                        </button>

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            navigate('/plans');
                            if (onNavigate) onNavigate("plans");
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Upgrade Plan
                        </button>

                        <div className="border-t border-slate-100 mt-2 pt-2">
                          <button
                            onClick={handleSignOut}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              // Login Buttons
              <div className="flex items-center gap-2">
                <button
                  onClick={signInWithGoogle}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition text-sm font-medium"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                
                <button
                  onClick={signInWithGithub}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-900 transition text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  GitHub
                </button>
              </div>
            )}

            {/* Language Selector */}
            <select
              aria-label="Language"
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              className="text-sm text-slate-600 bg-transparent cursor-pointer border border-slate-300 rounded px-2 py-1 ml-2"
            >
              <option value="en">EN</option>
              <option value="pt">PT</option>
            </select>
          </div>
        </nav>
      </div>
    </header>
  );
}