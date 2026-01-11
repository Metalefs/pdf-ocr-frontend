import React from "react";
import { useI18n } from "../i18n";
import { useAuth } from "../contexts/AuthContext";

/*
  Componente Header
  - Exibe título da aplicação
  - Fornece navegação para Plans e Account
  - Fornece botões de autenticação
  - Mantém marcação simples e acessível para fácil estilização
*/

export default function Header({ currentPage = "home", onNavigate }) {
  const { t } = useI18n();
  const { user, loading, signInWithGoogle, signInWithGithub, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div 
          className="flex items-center gap-4 cursor-pointer" 
          onClick={() => onNavigate && onNavigate("home")}
        >
          <div className="text-2xl font-bold text-slate-800">{t("header.brand")}</div>
          <div className="text-sm text-slate-500">{t("header.subtitle")}</div>
        </div>

        <nav className="flex items-center gap-4">
          <button
            onClick={() => onNavigate && onNavigate("home")}
            className={`text-sm font-medium transition ${
              currentPage === "home"
                ? "text-sky-600"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            Home
          </button>
          
          <button
            onClick={() => onNavigate && onNavigate("plans")}
            className={`text-sm font-medium transition ${
              currentPage === "plans"
                ? "text-sky-600"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            Plans
          </button>

          {user && (
            <button
              onClick={() => onNavigate && onNavigate("account")}
              className={`text-sm font-medium transition ${
                currentPage === "account"
                  ? "text-sky-600"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              Account
            </button>
          )}

          {/* User Menu */}
          <div className="ml-2 flex items-center gap-2">
            {!loading ? (
              user ? (
                <div className="flex items-center gap-2">
                  {user.avatar && (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div className="text-sm text-slate-700">{user.name}</div>
                  <button
                    onClick={signOut}
                    className="text-sm text-slate-600 hover:text-slate-800 transition"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={signInWithGoogle}
                    className="text-sm px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
                  >
                    Google
                  </button>
                  <button
                    onClick={signInWithGithub}
                    className="text-sm px-3 py-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-900 transition"
                  >
                    GitHub
                  </button>
                </div>
              )
            ) : (
              <div className="text-sm text-slate-500">Loading...</div>
            )}

            {/* Language Selector */}
            <select
              aria-label="Language"
              value={useI18n().locale}
              onChange={(e) => useI18n().setLocale(e.target.value)}
              className="text-sm text-slate-600 bg-transparent cursor-pointer ml-2"
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