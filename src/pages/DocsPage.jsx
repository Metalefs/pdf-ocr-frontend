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

  const baseUrl = "https://pdf-ocr-api-production.up.railway.app";

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
        ? "Documentação da plataforma TextLayer OCR: endpoints da API, autenticação por API key, processamento assíncrono e preservação de formulários (AcroForm)."
        : "TextLayer OCR documentation: API endpoints, API key authentication, async processing and AcroForm preservation."
    );
  }, [isPt]);

  return (
   <>
    <TechArticleSchema 
        title="TextLayer OCR API Documentation"
        description="Complete API reference for PDF OCR processing"
        url="https://pdf-ocr-frontend.onrender.com/docs"
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
                  ? "Fluxo recomendado (assíncrono) para processar PDFs e baixar o arquivo final preservando formulários (AcroForm)."
                  : "Recommended async flow to process PDFs and download the final file while preserving forms (AcroForm)."}
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <Button component={RouterLink} to="/docs/api" variant="contained">
                  {isPt ? "Abrir referência da API" : "Open API reference"}
                </Button>
                <Button component="a" href={`${baseUrl}/swagger/index.html`} target="_blank" rel="noreferrer" variant="outlined">
                  {isPt ? "Ver Swagger" : "View Swagger"}
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

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: 1.5, flexWrap: "wrap" }}>
                  <Chip size="small" label="POST /api/Pdf/process" color="primary" variant="outlined" />
                  <Chip size="small" label="GET /api/Jobs/{jobId}/status" variant="outlined" />
                  <Chip size="small" label="GET /api/Jobs/{jobId}/download" variant="outlined" />
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {isPt ? "Autenticação" : "Authentication"}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                  {isPt
                    ? "Server-to-server: use X-API-Key. App autenticado: use Authorization: Bearer <token>."
                    : "Server-to-server: use X-API-Key. Authenticated app: use Authorization: Bearer <token>."}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {isPt ? "1) Enviar PDF" : "1) Upload PDF"}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {isPt
                    ? "Request (multipart/form-data): campo obrigatório `File` (PDF)."
                    : "Request (multipart/form-data): required field `File` (PDF)."}
                </Typography>

                <CodeBlock title={isPt ? "Exemplo (cURL)" : "Example (cURL)"} code={curlAsync} />

                <Typography variant="body2" color="text.secondary" sx={{ mt: 1.25 }}>
                  {isPt
                    ? "Response 200 (ProcessResponse):"
                    : "200 Response (ProcessResponse):"}
                </Typography>
                <CodeBlock title="application/json" code={processResponseExample} />

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {isPt ? "2) Acompanhar status" : "2) Poll status"}
                </Typography>

                <CodeBlock
                  title="GET /api/Jobs/{jobId}/status"
                  code={`curl -s ${baseUrl}/api/Jobs/9b7a0c1c2b3d4e5f/status \\\n+  -H "Accept-Language: ${isPt ? "pt-BR" : "en"}" \\\n+  -H "X-API-Key: sk_live_..."`}
                />

                <Typography variant="body2" color="text.secondary" sx={{ mt: 1.25 }}>
                  {isPt ? "Response 200 (JobStatusResponse):" : "200 Response (JobStatusResponse):"}
                </Typography>
                <CodeBlock title="application/json" code={jobStatusExample} />

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {isPt ? "3) Baixar o PDF" : "3) Download the PDF"}
                </Typography>

                <CodeBlock
                  title="GET /api/Jobs/{jobId}/download"
                  code={`curl -L ${baseUrl}/api/Jobs/9b7a0c1c2b3d4e5f/download \\\n+  -H "X-API-Key: sk_live_..." \\\n+  -o result.pdf`}
                />

                <Typography variant="body2" color="text.secondary" sx={{ mt: 1.25 }}>
                  {isPt
                    ? "Response 200: arquivo PDF (binário)."
                    : "200 Response: PDF file (binary)."}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {isPt ? "Processamento síncrono" : "Synchronous processing"}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                  {isPt
                    ? "Para fluxos simples, o endpoint /api/Pdf/process-sync retorna o PDF diretamente (binário)."
                    : "For simple flows, /api/Pdf/process-sync returns the PDF directly (binary)."}
                </Typography>

                <CodeBlock
                  title="POST /api/Pdf/process-sync"
                  code={`curl -X POST ${baseUrl}/api/Pdf/process-sync \\\n+  -H "X-API-Key: sk_live_..." \\\n+  -H "Content-Type: multipart/form-data" \\\n+  -F "File=@document.pdf" \\\n+  -o result.pdf`}
                />

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {isPt ? "Erros (ErrorResponse)" : "Errors (ErrorResponse)"}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                  {isPt
                    ? "Em 400/500 a API retorna um ErrorResponse com `error`, `details` e (quando aplicável) `upgradeUrl`."
                    : "On 400/500 the API returns an ErrorResponse with `error`, `details` and (when applicable) `upgradeUrl`."}
                </Typography>
                <CodeBlock title="application/json" code={errorResponseExample} />

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: 2 }}>
                  <Button component={RouterLink} to="/docs/api" variant="contained">
                    {isPt ? "Ver referência da API" : "View API reference"}
                  </Button>
                  <Button component={RouterLink} to="/guides/pdfjs-font-encoding" variant="outlined">
                    {isPt ? "Guia: pdf.js vs PDFium" : "Guide: pdf.js vs PDFium"}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {isPt ? "Dicas de integração" : "Integration tips"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {isPt
                      ? "Use o modo assíncrono para lotes, trate timeouts e cacheie resultados por hash do arquivo."
                      : "Use async mode for batches, handle timeouts, and cache results by file hash."}
                  </Typography>
                </CardContent>
              </Card>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                pdf.js, PDFium, AcroForm, toUnicode, font encoding, OCR preservando formulários.
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
    </>
  );
}
