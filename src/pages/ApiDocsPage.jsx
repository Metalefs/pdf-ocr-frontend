import { useEffect } from "react";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useI18n } from "../i18n";

function setMetaDescription(content) {
  const tag = document.querySelector('meta[name="description"]');
  if (tag) tag.setAttribute("content", content);
}

export default function ApiDocsPage() {
  const { locale } = useI18n();
  const isPt = String(locale).toLowerCase().startsWith("pt");

  useEffect(() => {
    document.title = isPt ? "API — TextLayer OCR" : "API — TextLayer OCR";
    setMetaDescription(
      isPt
        ? "Referência da API do TextLayer OCR: autenticação, endpoints /api/Pdf/process, jobs, planos e erros."
        : "TextLayer OCR API reference: auth, /api/Pdf/process, jobs, plans and errors."
    );
  }, [isPt]);

  return (
    <Box sx={{ bgcolor: "background.default", py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -0.5 }}>
            {isPt ? "Referência da API" : "API Reference"}
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 980 }}>
            {isPt
              ? "Rotas principais para processar PDFs preservando formulários e corrigindo fontes/mapeamentos Unicode." 
              : "Main routes to process PDFs while preserving forms and fixing fonts/Unicode maps."}
          </Typography>
        </Stack>

        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          {isPt ? "Autenticação" : "Authentication"}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          {isPt
            ? "Para chamadas server-to-server, use o header X-API-Key. Para chamadas do app com usuário logado, use Authorization: Bearer <token>."
            : "For server-to-server calls, use X-API-Key. For app calls with logged-in users, use Authorization: Bearer <token>."}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          {isPt ? "Processamento" : "Processing"}
        </Typography>

        <Box component="pre" sx={{ mt: 1.5, p: 2, bgcolor: "action.hover", borderRadius: 2, overflowX: "auto", border: 1, borderColor: "divider" }}>
          <code>{`POST /api/Pdf/process\nContent-Type: multipart/form-data\nX-API-Key: sk_live_...\n\nForm fields:\n- file: PDF`}</code>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {isPt
            ? "Retorna jobId e URLs relativas para status/download."
            : "Returns jobId and relative URLs for status/download."}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          Jobs
        </Typography>
        <Box component="pre" sx={{ mt: 1.5, p: 2, bgcolor: "action.hover", borderRadius: 2, overflowX: "auto", border: 1, borderColor: "divider" }}>
          <code>{`GET /api/jobs/{jobId}/status\nGET /api/jobs/{jobId}/download`}</code>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          {isPt ? "Planos" : "Plans"}
        </Typography>
        <Box component="pre" sx={{ mt: 1.5, p: 2, bgcolor: "action.hover", borderRadius: 2, overflowX: "auto", border: 1, borderColor: "divider" }}>
          <code>{`GET /api/payment/plans`}</code>
        </Box>

      </Container>
    </Box>
  );
}
