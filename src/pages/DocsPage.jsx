import { useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import CodeBlock from "../components/CodeBlock";

import { useI18n } from "../i18n";
import { TechArticleSchema } from '../components/SEOSchema';

function setMetaDescription(content) {
  const tag = document.querySelector('meta[name="description"]');
  if (tag) tag.setAttribute("content", content);
}

export default function DocsPage() {
  const { locale } = useI18n();
  const isPt = String(locale).toLowerCase().startsWith("pt");

  const publicSiteUrl = (import.meta?.env?.VITE_PUBLIC_SITE_URL || (typeof window !== "undefined" ? window.location.origin : "https://textlayerocr.up.railway.app"));

  const baseUrl = (import.meta?.env?.VITE_API_BASE || import.meta?.env?.VITE_API_URL || "https://pdf-ocr-api-production.up.railway.app").replace(/\/$/, "");

  const curlAsync = `curl -X POST ${baseUrl}/api/Pdf/process \\\n+  -H "Accept-Language: ${isPt ? "pt-BR" : "en"}" \\\n+  -H "X-API-Key: sk_live_..." \\\n+  -H "Content-Type: multipart/form-data" \\\n+  -F "File=@document.pdf"`;

  const processResponseExample = `{
  "jobId": "9b7a0c1c2b3d4e5f",
  "status": "queued",
  "message": "Job created",
  "statusUrl": "/api/Jobs/9b7a0c1c2b3d4e5f/status",
  "downloadUrl": "/api/Jobs/9b7a0c1c2b3d4e5f/download",
  "creditsRemaining": 123,
  "upgradeMessage": null
}`;

  const jobStatusExample = `{
  "jobId": "9b7a0c1c2b3d4e5f",
  "status": "processing",
  "fileName": "document.pdf",
  "fileSize": 1048576,
  "createdAt": "2026-01-15T12:00:00Z",
  "completedAt": null,
  "progress": 42,
  "estimatedTimeRemaining": "00:00:12",
  "message": "OCR running",
  "stage": "ocr",
  "totalPages": 10,
  "processedPages": 4,
  "activePages": [5],
  "downloadUrl": "/api/Jobs/9b7a0c1c2b3d4e5f/download",
  "logs": ["queued", "processing page 1", "processing page 2"],
  "error": null
}`;

  const errorResponseExample = `{
  "error": "Bad Request",
  "details": "Missing File",
  "upgradeUrl": "/plans",
  "logs": ["validation failed"],
  "timestamp": "2026-01-15T12:00:00Z"
}`;

  useEffect(() => {
    document.title = isPt
      ? "Docs — TextLayer OCR (Plataforma e API)"
      : "Docs — TextLayer OCR (Platform & API)";

    setMetaDescription(
      isPt
        ? "Documentação da plataforma TextLayer OCR: endpoints da API, autenticação por API key e processamento assíncrono."
        : "TextLayer OCR documentation: API endpoints, API key authentication, and async processing."
    );
  }, [isPt]);

  return (
   <>
    <TechArticleSchema 
        title="TextLayer OCR API Documentation"
        description="Complete API reference for PDF OCR processing"
        url={`${publicSiteUrl}/docs`}
      />
    <Box sx={{ bgcolor: "background.default", py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <Paper
          variant="outlined"
          sx={(theme) => ({
            mb: 3,
            borderRadius: 4,
            borderColor: "divider",
            overflow: "hidden",
            background: `linear-gradient(135deg, rgba(99,102,241,0.10) 0%, rgba(14,165,233,0.08) 45%, ${theme.palette.background.paper} 100%)`,
          })}
        >
          <Box sx={{ p: { xs: 2.5, md: 3 } }}>
            <Stack spacing={1.25}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "flex-start", sm: "center" }}>
                <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -0.5, lineHeight: 1.1 }}>
                  {isPt ? "Documentação" : "Documentation"}
                </Typography>
                <Chip size="small" label={isPt ? "Guia rápido" : "Quickstart"} sx={{ fontWeight: 700 }} />
              </Stack>

              <Typography color="text.secondary" sx={{ maxWidth: 980 }}>
                {isPt
                  ? "Envie PDF → Acompanhe progresso → Baixe resultado."
                  : "Upload PDF → Track progress → Download result."}
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <Button component={RouterLink} to="/docs/api" variant="outlined" size="small">
                  {isPt ? "Referência completa" : "Full API reference"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>

        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>
                  {isPt ? "Como funciona (assíncrono)" : "How it works (async)"}
                </Typography>

                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  {isPt
                    ? "Você envia um PDF via multipart/form-data. A API cria um job assíncrono e retorna URLs para acompanhar o status e fazer download."
                    : "You upload a PDF via multipart/form-data. The API creates an async job and returns URLs to poll status and download the result."}
                </Typography>

                <Accordion variant="outlined" disableGutters sx={{ mt: 1.5, borderRadius: 2, overflow: "hidden" }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "flex-start", sm: "center" }}>
                      <Typography sx={{ fontWeight: 900 }}>
                        {isPt ? "Endpoints (resumo)" : "Endpoints (quick view)"}
                      </Typography>
                      <Chip size="small" label="POST /api/Pdf/process" color="primary" variant="outlined" />
                      <Chip size="small" label="GET /api/Jobs/{jobId}/status" variant="outlined" />
                      <Chip size="small" label="GET /api/Jobs/{jobId}/download" variant="outlined" />
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={1.1}>
                      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "flex-start", sm: "center" }}>
                        <Chip size="small" label="POST" color="primary" />
                        <Typography sx={{ fontWeight: 900 }}>/api/Pdf/process</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {isPt ? "Cria job assíncrono" : "Creates an async job"}
                        </Typography>
                      </Stack>
                      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "flex-start", sm: "center" }}>
                        <Chip size="small" label="GET" />
                        <Typography sx={{ fontWeight: 900 }}>/api/Jobs/{"{jobId}"}/status</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {isPt ? "Acompanha progresso" : "Polls progress"}
                        </Typography>
                      </Stack>
                      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "flex-start", sm: "center" }}>
                        <Chip size="small" label="GET" />
                        <Typography sx={{ fontWeight: 900 }}>/api/Jobs/{"{jobId}"}/download</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {isPt ? "Baixa o PDF final" : "Downloads the final PDF"}
                        </Typography>
                      </Stack>
                      <Divider />
                      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "flex-start", sm: "center" }}>
                        <Chip size="small" label="POST" color="primary" />
                        <Typography sx={{ fontWeight: 900 }}>/api/Pdf/process-sync</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {isPt ? "Retorna o PDF direto (binário)" : "Returns PDF directly (binary)"}
                        </Typography>
                      </Stack>
                    </Stack>
                  </AccordionDetails>
                </Accordion>

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    mt: 2,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "action.hover",
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {isPt ? "🔑 Auth:" : "🔑 Auth:"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    X-API-Key: sk_live_...
                  </Typography>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {isPt ? "1) Enviar PDF" : "1) Upload PDF"}
                </Typography>

                <CodeBlock title="POST /api/Pdf/process" code={curlAsync} />

                <Accordion variant="outlined" disableGutters sx={{ mt: 1, borderRadius: 1.5 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {isPt ? "Ver response" : "View response"}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <CodeBlock title="application/json" code={processResponseExample} />
                  </AccordionDetails>
                </Accordion>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {isPt ? "2) Acompanhar status" : "2) Poll status"}
                </Typography>

                <CodeBlock
                  title="GET /api/Jobs/{jobId}/status"
                  code={`curl ${baseUrl}/api/Jobs/{jobId}/status -H "X-API-Key: sk_live_..."`}
                />

                <Accordion variant="outlined" disableGutters sx={{ mt: 1, borderRadius: 1.5 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {isPt ? "Ver response" : "View response"}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <CodeBlock title="application/json" code={jobStatusExample} />
                  </AccordionDetails>
                </Accordion>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {isPt ? "3) Baixar resultado" : "3) Download result"}
                </Typography>

                <CodeBlock
                  title="GET /api/Jobs/{jobId}/download"
                  code={`curl -L ${baseUrl}/api/Jobs/{jobId}/download -H "X-API-Key: sk_live_..." -o result.pdf`}
                />

                <Divider sx={{ my: 2 }} />

                <Accordion variant="outlined" disableGutters sx={{ borderRadius: 1.5 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {isPt ? "💡 Opção: Modo síncrono" : "💡 Option: Sync mode"}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {isPt
                        ? "Para PDFs pequenos, use /api/Pdf/process-sync que retorna o arquivo diretamente (sem polling)."
                        : "For small PDFs, use /api/Pdf/process-sync which returns the file directly (no polling)."}
                    </Typography>
                    <CodeBlock
                      title="POST /api/Pdf/process-sync"
                      code={`curl -X POST ${baseUrl}/api/Pdf/process-sync -H "X-API-Key: sk_live_..." -F "File=@doc.pdf" -o result.pdf`}
                    />
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {isPt ? "💡 Dicas" : "💡 Tips"}
                  </Typography>
                  <Stack spacing={1} sx={{ mt: 1.25 }}>
                    <Typography variant="body2" color="text.secondary">
                      • {isPt ? "Use modo assíncrono para lotes" : "Use async mode for batches"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • {isPt ? "Cache resultados por hash" : "Cache results by file hash"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • {isPt ? "Timeout recomendado: 60s" : "Recommended timeout: 60s"}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {isPt ? "🔗 Links úteis" : "🔗 Useful links"}
                  </Typography>
                  <Stack spacing={1} sx={{ mt: 1.25 }}>
                    <Button component={RouterLink} to="/docs/api" variant="outlined" size="small" fullWidth sx={{ justifyContent: "flex-start" }}>
                      {isPt ? "Referência completa da API" : "Full API reference"}
                    </Button>
                    <Button component="a" href={`${baseUrl}/swagger/index.html`} target="_blank" rel="noreferrer" variant="outlined" size="small" fullWidth sx={{ justifyContent: "flex-start" }}>
                      Swagger UI
                    </Button>
                    <Button component={RouterLink} to="/guides/pdfjs-font-encoding" variant="outlined" size="small" fullWidth sx={{ justifyContent: "flex-start" }}>
                      {isPt ? "Guia: pdf.js vs PDFium" : "Guide: pdf.js vs PDFium"}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
    </>
  );
}
