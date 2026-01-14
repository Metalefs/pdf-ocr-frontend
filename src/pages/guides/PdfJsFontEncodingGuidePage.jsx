import { useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useI18n } from "../../i18n";

function setMeta(name, content) {
  const tag = document.querySelector(`meta[name="${name}"]`);
  if (tag) tag.setAttribute("content", content);
}

export default function PdfJsFontEncodingGuidePage() {
  const { locale } = useI18n();
  const isPt = String(locale).toLowerCase().startsWith("pt");

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

  return (
    <Box sx={{ bgcolor: "background.default", py: { xs: 3, md: 5 } }}>
      <Container maxWidth="md">
        <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -0.5 }}>
          {isPt
            ? "pdf.js exibindo caracteres errados?"
            : "pdf.js showing wrong characters?"}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1.25 }}>
          {isPt
            ? "Quando um PDF parece correto no Adobe Reader/PDFium, mas fica com caracteres trocados no pdf.js, o problema frequentemente é mapeamento Unicode (toUnicode) e/ou recursos de fonte incompletos."
            : "When a PDF looks correct in Adobe Reader/PDFium but shows wrong glyphs in pdf.js, the issue is often Unicode mapping (toUnicode) and/or incomplete font resources."}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          {isPt ? "O que causa isso" : "What causes this"}
        </Typography>
        <Stack spacing={1} sx={{ mt: 1.5 }}>
          <Typography color="text.secondary">
            {isPt
              ? "• PDFs legados podem ter CMaps/mapeamentos ausentes, causando divergência na seleção/cópia e renderização."
              : "• Legacy PDFs may miss CMaps/Unicode maps, causing selection/copy and rendering differences."}
          </Typography>
          <Typography color="text.secondary">
            {isPt
              ? "• O pdf.js depende fortemente de toUnicode para mapear glifos → caracteres."
              : "• pdf.js relies heavily on toUnicode to map glyphs → characters."}
          </Typography>
          <Typography color="text.secondary">
            {isPt
              ? "• Alguns PDFs têm fontes embutidas parcialmente, fontes substituídas, ou referências quebradas."
              : "• Some PDFs have partially embedded fonts, substituted fonts, or broken references."}
          </Typography>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          {isPt ? "O problema de preservar formulários" : "The hard part: preserving forms"}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1.25 }}>
          {isPt
            ? "Muitas abordagens de “recriar PDF” quebram campos AcroForm (widgets, appearances, ações) e isso é inaceitável quando o formulário é parte do fluxo do documento. A plataforma foi pensada para regenerar recursos de fonte/toUnicode mantendo as propriedades e interatividade do PDF original."
            : "Many “rebuild PDF” approaches break AcroForm fields (widgets, appearances, actions) and this is unacceptable when forms are essential. The platform regenerates font/toUnicode resources while preserving original PDF properties and interactivity."}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              {isPt ? "Como usar a plataforma" : "How to use the platform"}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {isPt
                ? "1) Faça upload na Home ou chame a API. 2) Aguarde o job finalizar. 3) Baixe o PDF corrigido e valide em pdf.js, PDFium e Adobe Reader."
                : "1) Upload on Home or call the API. 2) Wait for the job. 3) Download the fixed PDF and validate in pdf.js, PDFium and Adobe Reader."}
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: 2 }}>
              <Button component={RouterLink} to="/" variant="contained">
                {isPt ? "Ir para o upload" : "Go to upload"}
              </Button>
              <Button component={RouterLink} to="/docs" variant="outlined">
                {isPt ? "Ler documentação" : "Read docs"}
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
          {isPt
            ? "Keywords: pdf.js fonte errada, toUnicode, PDFium, AcroForm, caracteres trocados, copiar/colar PDF."
            : "Keywords: pdf.js wrong font, toUnicode, PDFium, AcroForm, wrong characters, PDF copy/paste."}
        </Typography>
      </Container>
    </Box>
  );
}
