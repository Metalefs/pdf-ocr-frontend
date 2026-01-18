import React, { createContext, useContext, useEffect, useState } from "react";

const translations = {
  en: {
    header: {
      brand: "TextLayer OCR",
      subtitle: "Fix broken PDF text • Searchable OCR • API-ready",
      nav: { features: "Features", docs: "Docs", textTest: "Text Test", apiKeys: "API Keys", blog: "Blog", cta: "Get Started" },
    },
    hero: {
      title: "Fix broken PDF text — without losing forms.",
      subtitle:
        "OCR + font/toUnicode repair for consistent rendering and searchable text. Use the UI or integrate via API.",
      uniqueClaim:
        "* Fix toUnicode/font issues without flattening the PDF.",
        claims: [
          "If the PDF has digital signatures, we attach the original.",
          "High-performance for multi-page documents.",
          "Fixes missing 'toUnicode' maps in legacy PDF files.",
          "Fixes clipboard data in PDFs so copied text is correct.",
          "Fixes malformed characters rendered in pdf.js and other viewers.",
          "Small file size",
          "Zero storage: no files are permanently saved",
        ],
      feature1: { title: "Reliable Accuracy", desc: "High-fidelity OCR tuned for documents and form fields." },
      feature2: { title: "Total Privacy", desc: "In-memory processing, zero storage, no data trail." },
    },
    why: {
      title: "Why this exists",
      body1:
        "Corrupted or incomplete PDF fonts can produce unreadable characters and inconsistent rendering across viewers.",
      body2:
        "Most ‘fix’ approaches rebuild the PDF and can break forms and metadata. This API repairs font resources while keeping the original document structure intact — improving rendering without a destructive rebuild.",
      bullets: [
        "Fixes missing/invalid font resources and Unicode maps (toUnicode)",
        "Avoids flattening/rebuilding the PDF",
        "Normalizes rendering across viewers (pdf.js, PDFium, Adobe Reader)",
      ],
    },
    useCases: {
      title: "Use cases for the platform & API",
      items: [
        {
          title: "Consistent rendering across viewers",
          desc: "Make PDFs look the same in pdf.js (web), PDFium (Chromium), and Adobe Reader by repairing font encoding and mappings.",
        },
        {
          title: "Regenerate fonts without breaking forms",
          desc: "Repair missing/broken font resources while keeping the document structure intact.",
        },
        {
          title: "Fix copy/paste and text extraction",
          desc: "Correct malformed characters by fixing Unicode mappings so users can search, select, and copy text correctly.",
        },
        {
          title: "Add selection/search to form-heavy PDFs",
          desc: "Enable reliable text selection and indexing on PDFs where forms are essential and fonts are incomplete or missing.",
        },
        {
          title: "Batch processing via API",
          desc: "Integrate with DMS/ECM pipelines to process thousands of PDFs asynchronously and retrieve results programmatically.",
        },
        {
          title: "Pre-processing before signing or archiving",
          desc: "Normalize PDFs for long-term retention and downstream workflows while keeping signatures and document properties intact.",
        },
      ],
    },
    upload: {
      promptTitle: "Drop or click to upload your PDF",
      promptSubtitle: "Max 10MB — keeps layout intact; if digitally signed, we attach the original",
      chooseAnother: "Choose another file",
      multilangNote: "Supports multiple languages in the same file | detects languages automatically and supports multi-language OCR (PT, EN, AR, ZH, JP, KO, CHI, RUS).",
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
    tools: {
      text: {
        title: "Extract text from a PDF",
        subtitle: "Runs OCR and returns the extracted text (JSON).",
        button: "Run OCR → Text",
        demoNote: "Demo: 1MB limit and 3 calls/24h.",
        authNote: "Authenticated: uses your credits.",
        resultTitle: "Extracted text",
        empty: "[No text extracted]",
        copy: "Copy",
      },
    },
    sidebar: {
      title: "Document Preview",
      preserve: "Non-destructive output",
      none: "No document processed yet",
      sendPdf: "Upload a PDF to preview",
      open: "Open",
      download: "Download",
    },
    footer: { technology: "Technology", privacy: "Privacy", copy: "All rights reserved." },
    blog: {
      title: "Blog",
      subtitle: "Practical posts about OCR, PDFs and integrations.",
      featured: "Featured",
      allPosts: "All posts",
      readTime: "{{count}} min",
      notFoundTitle: "Post not found",
      notFoundBody: "This link may be incorrect or the post was moved.",
      backToBlog: "Back to blog",
      nextSteps: "Next steps",
      nextStepsBody: "Want to apply this to your workflow? Check Docs and the API reference.",
      openDocs: "Open Docs",
      openApi: "Open API",
      onThisPage: "On this page",
      relatedPosts: "Related posts",
    },
    apiKeys: {
      title: "API Keys",
      description: "Use API keys to access our API programmatically.",
      loginRequired: "Please log in to manage your API keys",
      createTitle: "Create new key",
      createPlaceholder: "Key name (eg: Production, Mobile)",
      createButton: "Create",
      creating: "Creating...",
      alertTitle: "Save this key now",
      alertDescription: "For security, this key will be shown only once.",
      copy: "Copy",
      copied: "✓ Copied!",
      okSaved: "OK, saved",
      activeKeys: "Your active keys",
      loading: "Loading...",
      noKeys: "No keys created yet",
      revoke: "Revoke",
      howTo: {
        title: "How to use",
        authHeader: "Include your API key in the request header:",
        curlExample: "curl -X POST {base}/api/Pdf/process -H \"X-API-Key: sk_live_abc123...\" -H \"Accept-Language: en\" -H \"Content-Type: multipart/form-data\" -F \"File=@document.pdf\"",
        jsExample: "fetch('{base}/api/Pdf/process', { method: 'POST', headers: { 'X-API-Key': 'sk_live_abc123...', 'Accept-Language': 'en', 'Content-Type': 'multipart/form-data' } })",
      },
    },
    contact: {
      partnerText: "For partnership or enterprise inquiries, email {email} with the subject 'Partnership Inquiry' and we'll reply within 2 business days.",
    },
    authDialog: {
      title: 'Sign In Required',
      message: 'You have reached the demo limit. Create a free account to continue processing PDFs or upgrade to a paid plan for unlimited access.',
      signIn: 'Sign In / Create Account',
      viewPlans: 'View Plans & Pricing',
      cancel: 'Cancel',
      benefits: 'Free account includes 10 credits per month',
    },
    plans: {
      header: 'Pricing Plans',
      subtitle: 'Choose the plan that best suits your needs',
      apiAccess: 'API Access',
      apiIncludedYes: 'Included (API keys enabled)',
      apiIncludedNo: 'Not included',
      "features": {
        "basicProcessing": "Basic processing",
        "priorityProcessing": "Priority processing",
        "maxProcessing": "Maximum processing speed",
        "emailSupport": "Email support",
        "prioritySupport": "Priority support",
        "support24x7": "24/7 support",
        "apiAccess": "API access",
        "unlimitedApi": "Unlimited API",
        "webhooks": "Custom webhooks",
        "advancedDashboard": "Advanced dashboard",
        "customReports": "Custom reports"
      },
      "credits": {
        "label": "{{count}} credits/month"
      }
    },
    errors: {
      generic: "An error occurred",
      jobNotFound: "This processing job no longer exists (it may have expired). Please upload and process the PDF again.",
      processAgain: "Process again",
      apiUnavailable: "Service unavailable",
      apiUnavailableDetails: "The API appears to be offline or unreachable. Please try again in a moment.",
      tryAgain: "Try again",
    },
  },
  pt: {
    header: {
      brand: "TextLayer OCR",
      subtitle: "Corrige texto do PDF • OCR pesquisável • API pronta",
      nav: { features: "Recursos", docs: "Docs", textTest: "Teste (Texto)", apiKeys: "Chaves de API", blog: "Blog", cta: "Começar" },
    },
    hero: {
      title: "Corrija texto quebrado em PDFs — sem perder formulários.",
      subtitle: "OCR + correção de fontes/toUnicode para renderização consistente e texto pesquisável. Use pela UI ou via API.",
      uniqueClaim:
        "Corrija toUnicode/fontes sem achatar (flatten) ou reconstruir o PDF.",
        claims: [
          "Se o PDF tiver assinaturas digitais, anexamos o original.",
          "Processamento paralelo para documentos com múltiplas páginas.",
          "Corrige mapas 'toUnicode' ausentes em arquivos PDF legados.",
          "Corrige a área de transferência em PDFs para que o texto copiado fique correto.",
          "Corrige caracteres malformados exibidos no pdf.js e outros visualizadores.",
          "Tamanho de arquivo pequeno",
          "Zero armazenamento: nenhum arquivo é gravado permanentemente",
        ],
      feature1: { title: "Precisão confiável", desc: "OCR de alta fidelidade ajustado para documentos e formulários." },
      feature2: { title: "Privacidade total", desc: "Processamento em memória, zero armazenamento, sem rastros de dados." },
    },
    why: {
      title: "Por que isso existe?",
      body1:
        "Fontes corrompidas em PDFs causam caracteres ilegíveis e incompatibilidade entre visualizadores. Soluções tradicionais destroem formulários e metadados ao tentar corrigir o problema.",
      body2:
        "Esta API corrige recursos de fonte mantendo a estrutura do documento original — sem reconstruções destrutivas que quebram formulários e metadados.",
      bullets: [
        "Regenera recursos de fontes e mapeamentos Unicode (toUnicode)",
        "Evita achatar (flatten) ou reconstruir o PDF",
        "Padroniza a visualização entre pdf.js, PDFium e Adobe Reader",
      ],
    },
    useCases: {
      title: "Casos de uso da plataforma e da API",
      items: [
        {
          title: "Correção de Encoding de Fontes",
          desc: "Resolva divergências de renderização entre navegadores, visualizadores nativos e Adobe Reader.",
        },
        {
          title: "Formulários Sem Fontes Incorporadas",
          desc: "Adicione suporte a seleção de texto em PDFs onde as fontes originais foram perdidas.",
        },
        {
          title: "Migração de Sistemas Legados",
          desc: "Atualize documentos antigos com fontes obsoletas para padrões modernos.",
        },
        {
          title: "Acessibilidade e OCR",
          desc: "Melhore a extração de texto e compatibilidade com leitores de tela.",
        },
        {
          title: "Automação de Workflows",
          desc: "Integre na pipeline de processamento de documentos (uploads, conversões, arquivamento).",
        },
        {
          title: "Compliance Documental",
          desc: "Garanta conformidade em arquivos que exigem fidelidade visual (contratos, certidões).",
        },
      ],
    },
    upload: {
      promptTitle: "Clique ou arraste seu PDF",
      promptSubtitle: "Máx 10MB — mantemos o layout; se for assinado, anexamos o original",
      chooseAnother: "Escolher outro arquivo",
      multilangNote: "Aceita múltiplos idiomas no mesmo arquivo | detecta idiomas automaticamente e suporta OCR multilíngue (PT, EN, AR, ZH, JP, KO, CHI, RUS)",
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
    tools: {
      text: {
        title: "Extrair texto de um PDF",
        subtitle: "Executa OCR e retorna o texto extraído (JSON).",
        button: "OCR → Texto",
        demoNote: "Demo: limite de 1MB e 3 chamadas/24h.",
        authNote: "Autenticado: consome seus créditos.",
        resultTitle: "Texto extraído",
        empty: "[Nenhum texto extraído]",
        copy: "Copiar",
      },
    },
    sidebar: {
      title: "Prévia do Documento",
      preserve: "Preserva formulários",
      none: "Nenhum documento processado ainda",
      sendPdf: "Envie um PDF para ver a pré‑visualização aqui",
      open: "Abrir",
      download: "Baixar",
    },
    footer: { technology: "Tecnologia", privacy: "Privacidade", copy: "Todos os direitos reservados." },
    blog: {
      title: "Blog",
      subtitle: "Posts práticos sobre OCR, PDFs e integrações.",
      featured: "Em destaque",
      allPosts: "Todos os posts",
      readTime: "{{count}} min",
      notFoundTitle: "Post não encontrado",
      notFoundBody: "Esse link pode estar incorreto ou o post foi movido.",
      backToBlog: "Voltar para o blog",
      nextSteps: "Próximos passos",
      nextStepsBody: "Quer aplicar isso no seu fluxo? Veja as Docs e a referência da API.",
      openDocs: "Abrir Docs",
      openApi: "Abrir API",
      onThisPage: "Nesta página",
      relatedPosts: "Leia também",
    },
    apiKeys: {
      title: "Chaves de API",
      description: "Use chaves de API para acessar nossa API programaticamente.",
      loginRequired: "Por favor, faça login para gerenciar suas chaves de API",
      createTitle: "Criar nova chave",
      createPlaceholder: "Nome da chave (ex: Produção, Mobile)",
      createButton: "Criar",
      creating: "Criando...",
      alertTitle: "Salve esta chave agora",
      alertDescription: "Por segurança, esta chave será exibida apenas uma vez.",
      copy: "Copiar",
      copied: "✓ Copiado!",
      okSaved: "OK, já salvei",
      activeKeys: "Suas chaves ativas",
      loading: "Carregando...",
      noKeys: "Nenhuma chave criada ainda",
      revoke: "Revogar",
      howTo: {
        title: "Como usar",
        authHeader: "Inclua sua chave de API no cabeçalho da requisição:",
        curlExample: "curl -X POST {base}/api/Pdf/process -H \"X-API-Key: sk_live_abc123...\" -H \"Accept-Language: pt-BR\" -H \"Content-Type: multipart/form-data\" -F \"File=@document.pdf\"",
        jsExample: "fetch('{base}/api/Pdf/process', { method: 'POST', headers: { 'X-API-Key': 'sk_live_abc123...', 'Accept-Language': 'pt-BR', 'Content-Type': 'multipart/form-data' } })",
      },
    },
    contact: {
      partnerText: "Para parcerias ou soluções empresariais, envie um email para {email} com o assunto 'Parceria' e responderemos em até 2 dias úteis.",
    },
    authDialog: {
      title: 'Login Necessário',
      message: 'Você atingiu o limite de demonstração. Crie uma conta gratuita para continuar processando PDFs ou faça upgrade para um plano pago com acesso ilimitado.',
      signIn: 'Entrar / Criar Conta',
      viewPlans: 'Ver Planos e Preços',
      cancel: 'Cancelar',
      benefits: 'Conta gratuita inclui 10 créditos por mês',
    },
    plans: {
      header: 'Planos',
      subtitle: 'Escolha o plano que melhor atende suas necessidades',
      apiAccess: 'Acesso à API',
      apiIncludedYes: 'Incluído (chaves de API habilitadas)',
      apiIncludedNo: 'Não incluído',
      "features": {
        "basicProcessing": "Processamento básico",
        "priorityProcessing": "Processamento prioritário",
        "maxProcessing": "Processamento máximo",
        "emailSupport": "Suporte por email",
        "prioritySupport": "Suporte prioritário",
        "support24x7": "Suporte 24/7",
        "apiAccess": "Acesso à API",
        "unlimitedApi": "API ilimitado",
        "webhooks": "Webhooks personalizados",
        "advancedDashboard": "Dashboard avançado",
        "customReports": "Relatórios customizados"
      },
      "credits": {
        "label": "{count} créditos/mês"
      }
    },
    errors: {
      generic: "Ocorreu um erro",
      jobNotFound: "Este job de processamento não existe mais (pode ter expirado). Envie e processe o PDF novamente.",
      processAgain: "Processar novamente",
      apiUnavailable: "Serviço indisponível",
      apiUnavailableDetails: "A API parece estar fora do ar ou inacessível. Tente novamente em instantes.",
      tryAgain: "Tentar novamente",
    },
  },
};

const I18nContext = createContext();

export function I18nProvider({ children, defaultLocale = "en" }) {
  const [locale, setLocale] = useState(() => {
    try {
      const stored = localStorage.getItem('locale');
      if (stored) return stored;
    } catch {
      // ignore
    }

    const nav = (typeof navigator !== 'undefined' && navigator.language) ? String(navigator.language).toLowerCase() : '';
    if (nav.startsWith('pt')) return 'pt';
    return defaultLocale;
  });

  useEffect(() => {
    try {
      localStorage.setItem('locale', locale);
    } catch {
      // ignore
    }
  }, [locale]);

  useEffect(() => {
    try {
      const lang = String(locale).toLowerCase().startsWith('pt') ? 'pt-BR' : 'en';
      document.documentElement.lang = lang;
    } catch {
      // ignore
    }
  }, [locale]);

  function t(path, vars) {
    const parts = path.split(".");
    let cur = translations[locale] || translations.en;
    for (const p of parts) {
      cur = cur?.[p];
      if (cur === undefined) return path;
    }
    if (vars) {
      return Object.keys(vars).reduce((s, k) => {
        const value = String(vars[k]);
        return String(s)
          .split(`{{${k}}}`).join(value)
          .split(`{${k}}`).join(value);
      }, cur);
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
