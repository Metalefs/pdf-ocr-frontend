import { useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import CodeBlock from "../../components/CodeBlock";
import BlogPostLayout from "../../components/BlogPostLayout";

import { useI18n } from "../../i18n";

function setMeta(name, content) {
  const tag = document.querySelector(`meta[name="${name}"]`);
  if (tag) tag.setAttribute("content", content);
}

export default function PdfJsFontEncodingGuidePage() {
  const { locale } = useI18n();
  const isPt = String(locale).toLowerCase().startsWith("pt");

  const anchors = {
    causes: "causes",
    quickCheck: "quick-check",
    avoid: "avoid",
    preserveForms: "preserve-forms",
  };

  useEffect(() => {
    document.title = isPt
      ? "pdf.js mostrando fonte errada? (toUnicode, PDFium, AcroForm)"
      : "pdf.js font rendering issues (toUnicode, PDFium, AcroForm)";

    setMeta(
      "description",
      isPt
        ? "Entenda por que alguns PDFs exibem caracteres errados no pdf.js e como corrigir fontes/toUnicode preservando formulários (AcroForm), mantendo consistência com PDFium e Adobe Reader."
        : "Why some PDFs render wrong characters in pdf.js and how to fix fonts/toUnicode while preserving AcroForm, matching PDFium and Adobe Reader."
    );
  }, [isPt]);

  const pdfJsQuickCheckSnippet = `// Quick sanity check: compare what you SEE vs what you COPY
// If selection/copy is wrong, toUnicode is usually missing or incorrect.

// In pdf.js, try selecting text and pasting it somewhere.
// If glyphs look correct but pasted text is wrong, fix Unicode mapping.`;

  const toc = [
    { href: `#${anchors.quickCheck}`, label: isPt ? "Sintoma e diagnóstico" : "Symptom and diagnosis" },
    { href: `#${anchors.causes}`, label: isPt ? "Causas comuns" : "Common causes" },
    { href: `#${anchors.avoid}`, label: isPt ? "O que evitar" : "What to avoid" },
    { href: `#${anchors.preserveForms}`, label: isPt ? "AcroForm: por que importa" : "AcroForm: why it matters" },
  ];

  const aside = (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 900 }}>
          {isPt ? "Leitura relacionada" : "Related"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {isPt
            ? "Se você está implementando um fluxo completo (upload → job → download), a página de documentação tem exemplos de request/response e headers."
            : "If you’re implementing a full flow (upload → job → download), the docs page includes request/response and header examples."}
        </Typography>
        <Divider sx={{ my: 1.5 }} />
        <Button component={RouterLink} to="/docs" variant="outlined" fullWidth>
          {isPt ? "Abrir Docs" : "Open Docs"}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <BlogPostLayout
      title={isPt ? "pdf.js exibindo caracteres errados?" : "pdf.js showing wrong characters?"}
      subtitle={
        isPt
          ? "Quando o PDF parece OK no Adobe Reader/PDFium, mas sai com caracteres trocados no pdf.js, o problema geralmente é mapeamento Unicode (toUnicode) e/ou recursos de fonte incompletos."
          : "When a PDF looks correct in Adobe Reader/PDFium but renders wrong characters in pdf.js, it’s usually Unicode mapping (toUnicode) and/or incomplete font resources."
      }
      eyebrow={isPt ? "Blog" : "Blog"}
      meta={isPt ? "15 jan 2026 · 4 min" : "Jan 15, 2026 · 4 min"}
      tags={isPt ? ["pdf.js", "toUnicode", "PDF", "AcroForm"] : ["pdf.js", "toUnicode", "PDF", "AcroForm"]}
      tocTitle={isPt ? "Nesta página" : "On this page"}
      toc={toc}
      aside={aside}
    >
      <Stack spacing={2.5}>
        <Typography color="text.secondary">
          {isPt
            ? "Este post é um guia rápido para entender o porquê do problema e como diagnosticar sem mergulhar em detalhes de implementação."
            : "This post is a quick guide to understand the cause and diagnose the issue without diving into implementation details."}
        </Typography>

        <Divider />

        <Stack spacing={1} id={anchors.quickCheck}>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>
            {isPt ? "Sintoma e diagnóstico" : "Symptom and diagnosis"}
          </Typography>
          <Typography color="text.secondary">
            {isPt
              ? "O sinal clássico: o texto parece correto na tela, mas ao selecionar/copiar/colar os caracteres saem errados. Isso normalmente aponta para um toUnicode ausente ou incorreto."
              : "The classic sign: text looks correct on screen, but selection/copy/paste produces wrong characters. That usually points to missing or incorrect toUnicode."}
          </Typography>
          <CodeBlock title={isPt ? "Checklist rápido" : "Quick checklist"} code={pdfJsQuickCheckSnippet} />
        </Stack>

        <Stack spacing={1} id={anchors.causes}>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>
            {isPt ? "Causas comuns" : "Common causes"}
          </Typography>
          <Typography color="text.secondary">
            {isPt
              ? "Em geral, você está lidando com PDFs legados (fontes parciais, CMaps faltando) ou com mapeamentos Unicode inconsistentes."
              : "In general, you’re dealing with legacy PDFs (partial fonts, missing CMaps) or inconsistent Unicode mapping."}
          </Typography>
          <Stack spacing={0.75}>
            <Typography color="text.secondary">• {isPt ? "CMap/toUnicode ausente ou inválido" : "Missing/invalid CMap/toUnicode"}</Typography>
            <Typography color="text.secondary">• {isPt ? "Fontes embutidas parcialmente ou substituídas" : "Partially embedded or substituted fonts"}</Typography>
            <Typography color="text.secondary">• {isPt ? "Diferença entre renderização (glifo) e extração (texto)" : "Mismatch between glyph rendering and text extraction"}</Typography>
          </Stack>
        </Stack>

        <Stack spacing={1} id={anchors.avoid}>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>
            {isPt ? "O que evitar" : "What to avoid"}
          </Typography>
          <Typography color="text.secondary">
            {isPt
              ? "“Recriar o PDF do zero” pode até corrigir a aparência, mas frequentemente perde metadados, anotações e, principalmente, formulários."
              : "“Rebuilding the PDF from scratch” may fix appearance, but often loses metadata, annotations, and especially forms."}
          </Typography>
        </Stack>

        <Stack spacing={1} id={anchors.preserveForms}>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>
            {isPt ? "AcroForm: por que importa" : "AcroForm: why it matters"}
          </Typography>
          <Typography color="text.secondary">
            {isPt
              ? "PDFs com AcroForm têm campos interativos (widgets, appearances, ações). Muitas abordagens “simples” quebram isso. Se o seu documento é um formulário, priorize soluções que preservem a estrutura original."
              : "PDFs with AcroForm have interactive fields (widgets, appearances, actions). Many “simple” approaches break this. If your document is a form, prioritize solutions that preserve the original structure."}
          </Typography>
        </Stack>

        <Divider />

        <Typography variant="body2" color="text.secondary">
          {isPt
            ? "Keywords: pdf.js fonte errada, toUnicode, PDFium, AcroForm, caracteres trocados, copiar/colar PDF."
            : "Keywords: pdf.js wrong characters, toUnicode, PDFium, AcroForm, PDF copy/paste."}
        </Typography>
      </Stack>
    </BlogPostLayout>
  );
}
