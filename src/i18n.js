import React, { createContext, useContext, useState } from "react";

const translations = {
  en: {
    header: {
      brand: "PDF OCR Pro",
      subtitle: "Preserve forms • Accurate OCR • Secure",
      nav: { features: "Features", docs: "Docs", cta: "Get Started" },
    },
    hero: {
      title: "OCR - With structure & widgets preserved",
      subtitle:
        "Convert scanned PDFs into editable documents while fixing resources, keeping widgets and layout intact.",
      uniqueClaim:
        "* Unicode maps and font fixing capabilities, preserving all widgets.",
        claims: [
          "Fixes missing 'toUnicode' maps in legacy PDF files.",
          "Fixes clipboard data in PDFs so copied text is correct.",
          "Fixes malformed characters rendered in pdf.js and other viewers.",
        ],
      feature1: { title: "Reliable Accuracy", desc: "High-fidelity OCR tuned for documents and form fields." },
      feature2: { title: "Enterprise Ready", desc: "Secure uploads, retention policies, and scalable processing." },
    },
    upload: {
      promptTitle: "Drop or click to upload your PDF",
      promptSubtitle: "Max 10MB — we preserve fields and layout",
      chooseAnother: "Choose another file",
      multilangNote: "Supports multiple languages in the same file | detects languages automatically and supports multi-language OCR (PT, EN, AR, ZH, JP, KO, CHI).",
    },
    process: {
      button: "Process PDF",
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
      title: "OCR de PDF com Preservação de Formulários",
      subtitle: "Converta PDFs escaneados em documentos editáveis mantendo widgets e layout.",
      uniqueClaim:
        "Corrija mapas ausentes, fontes malformadas e mantenha todos os widgets do PDF.",
        claims: [
          "Corrige mapas 'toUnicode' ausentes em arquivos PDF legados.",
          "Corrige dados da área de transferência em PDFs para que o texto copiado fique correto.",
          "Corrige caracteres malformados exibidos no pdf.js e outros visualizadores.",
        ],
      feature1: { title: "Precisão confiável", desc: "OCR de alta fidelidade ajustado para documentos e formulários." },
      feature2: { title: "Pronto para empresas", desc: "Uploads seguros, políticas de retenção e processamento escalável." },
    },
    upload: {
      promptTitle: "Clique ou arraste seu PDF",
      promptSubtitle: "Máx 10MB — preservamos campos e layout",
      chooseAnother: "Escolher outro arquivo",
      multilangNote: "Aceita múltiplos idiomas no mesmo arquivo | detecta idiomas automaticamente e suporta OCR multilíngue (PT, EN, AR, ZH, JP, KO, CHI)",
    },
    ar: {
      upload: {
        multilangNote: "يدعم عدة لغات في نفس الملف — يكتشف اللغات تلقائيًا ويدعم OCR متعدد اللغات (PT, EN, AR, ZH, JP, KO, CHI).",
      },
    },
    zh: {
      upload: {
        multilangNote: "支持在同一文件中包含多种语言 — 自动检测语言并支持多语言 OCR（PT、EN、AR、ZH、JP、KO、CHI）。",
      },
    },
    ja: {
      upload: {
        multilangNote: "同一ファイル内の複数言語に対応 — 言語を自動検出し、多言語 OCR をサポートします（PT、EN、AR、ZH、JP、KO、CHI）。",
      },
    },
    ko: {
      upload: {
        multilangNote: "하나의 파일에 여러 언어 허용 — 언어를 자동으로 감지하며 다국어 OCR을 지원합니다 (PT, EN, AR, ZH, JP, KO, CHI).",
      },
    },
    chi: {
      upload: {
        multilangNote: "支持在同一文件中包含多种语言 — 自动检测语言并支持多语言 OCR（PT、EN、AR、ZH、JP、KO、CHI）。",
      },
    },
    process: {
      button: "Processar",
      another: "Processar outro arquivo",
      asyncLabel: "Modo Assíncrono (Recomendado)",
      asyncDesc: "Processar em background e acompanhar progresso em tempo real",
      syncing: "Processando PDF...",
      uploading: "Enviando arquivo...",
      status: "Status:",
    },
    result: { completed: "Processamento concluído" },
    sidebar: {
      title: "Prévia do Documento",
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
