import React, { createContext, useContext, useState } from "react";

const translations = {
  en: {
    header: {
      brand: "PDF OCR Pro",
      subtitle: "Preserve forms • Accurate OCR • Secure",
      nav: { features: "Features", docs: "Docs", cta: "Get Started" },
    },
    hero: {
      title: "Accurate PDF OCR with Form Preservation",
      subtitle:
        "Convert scanned PDFs into editable documents while keeping form fields and layout intact.",
      feature1: { title: "Reliable Accuracy", desc: "High-fidelity OCR tuned for documents and form fields." },
      feature2: { title: "Enterprise Ready", desc: "Secure uploads, retention policies, and scalable processing." },
    },
    upload: {
      promptTitle: "Drop or click to upload your PDF",
      promptSubtitle: "Max 10MB — we preserve fields and layout",
      chooseAnother: "Choose another file",
    },
    process: {
      button: "Process PDF — OCR & Preserve Forms",
      another: "Process another file",
      asyncLabel: "Asynchronous Mode (Recommended)",
      asyncDesc: "Process in background and follow real-time progress",
      syncing: "Processing PDF...",
      uploading: "Uploading file...",
      status: "Status:",
    },
    result: { completed: "Processing completed" },
    sidebar: {
      title: "Document Preview",
      preserve: "Preserves form fields",
      none: "No document processed yet",
      sendPdf: "Upload a PDF to preview",
      open: "Open",
      download: "Download",
    },
    footer: { technology: "Technology", privacy: "Privacy", copy: "All rights reserved." },
    errors: { generic: "An error occurred" },
  },
  pt: {
    header: {
      brand: "PDF OCR Pro",
      subtitle: "Preserva formulários • OCR preciso • Seguro",
      nav: { features: "Recursos", docs: "Docs", cta: "Começar" },
    },
    hero: {
      title: "OCR de PDF preciso com preservação de formulário",
      subtitle: "Converta PDFs escaneados em documentos editáveis mantendo campos de formulário e layout.",
      feature1: { title: "Precisão confiável", desc: "OCR de alta fidelidade ajustado para documentos e formulários." },
      feature2: { title: "Pronto para empresas", desc: "Uploads seguros, políticas de retenção e processamento escalável." },
    },
    upload: {
      promptTitle: "Clique ou arraste seu PDF",
      promptSubtitle: "Máx 10MB — preservamos campos e layout",
      chooseAnother: "Escolher outro arquivo",
    },
    process: {
      button: "Processar PDF — OCR & Preservar Formulário",
      another: "Processar outro arquivo",
      asyncLabel: "Modo Assíncrono (Recomendado)",
      asyncDesc: "Processar em background e acompanhar progresso em tempo real",
      syncing: "Processando PDF...",
      uploading: "Enviando arquivo...",
      status: "Status:",
    },
    result: { completed: "Processamento concluído" },
    sidebar: {
      title: "Pré‑via do Documento",
      preserve: "Preserva formulários",
      none: "Nenhum documento processado ainda",
      sendPdf: "Envie um PDF para ver a pré‑visualização aqui",
      open: "Abrir",
      download: "Baixar",
    },
    footer: { technology: "Tecnologia", privacy: "Privacidade", copy: "Todos os direitos reservados." },
    errors: { generic: "Ocorreu um erro" },
  },
};

const I18nContext = createContext();

export function I18nProvider({ children, defaultLocale = "en" }) {
  const [locale, setLocale] = useState(defaultLocale);

  function t(path, vars) {
    const parts = path.split(".");
    let cur = translations[locale] || translations.en;
    for (const p of parts) {
      cur = cur?.[p];
      if (cur === undefined) return path;
    }
    if (vars) {
      return Object.keys(vars).reduce((s, k) => s.replace(`{${k}}`, vars[k]), cur);
    }
    return cur;
  }

  return React.createElement(
    I18nContext.Provider,
    { value: { t, locale, setLocale } },
    children
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

export default I18nContext;
