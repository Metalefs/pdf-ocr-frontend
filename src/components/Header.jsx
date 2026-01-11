import React from "react";
import { useI18n } from "../i18n";

/*
  Componente Header
  - Exibe título da aplicação
  - Fornece botão para selecionar arquivo PDF (dispara onFileSelect)
  - Mantém marcação simples e acessível para fácil estilização
*/

export default function Header() {

  return (
      <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-slate-800">{useI18n().t("header.brand")}</div>
                  <div className="text-sm text-slate-500">{useI18n().t("header.subtitle")}</div>
              </div>

              <nav className="flex items-center gap-4">
                  <a href="#features" className="text-sm text-slate-600 hover:text-slate-800">{useI18n().t("header.nav.features")}</a>
                  <a href="#docs" className="text-sm text-slate-600 hover:text-slate-800">{useI18n().t("header.nav.docs")}</a>
                  <a href="#app" className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition font-medium shadow-sm">{useI18n().t("header.nav.cta")}</a>
                  <div className="ml-2">
                      <select
                          aria-label="Language"
                          value={useI18n().locale}
                          onChange={(e) => useI18n().setLocale(e.target.value)}
                          className="text-sm text-slate-600 bg-transparent">
                          <option value="en">English</option>
                          <option value="pt">Português</option>
                      </select>
                  </div>
              </nav>
          </div>
      </header>
  );
}