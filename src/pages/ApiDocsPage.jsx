import { useEffect } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
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

function setMetaDescription(content) {
  const tag = document.querySelector('meta[name="description"]');
  if (tag) tag.setAttribute("content", content);
}

export default function ApiDocsPage() {
  const { locale } = useI18n();
  const isPt = String(locale).toLowerCase().startsWith("pt");

  const baseUrl = "https://pdf-ocr-api-production.up.railway.app";

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
        <Paper
          variant="outlined"
          sx={(theme) => ({
            mb: 3,
            borderRadius: 4,
            overflow: "hidden",
            background: `linear-gradient(135deg, rgba(14,165,233,0.10) 0%, rgba(99,102,241,0.08) 45%, ${theme.palette.background.paper} 100%)`,
          })}
        >
          <Box sx={{ p: { xs: 2.5, md: 3 } }}>
            <Stack spacing={1}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "flex-start", sm: "center" }}>
                <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -0.5, lineHeight: 1.1 }}>
                  {isPt ? "Referência da API" : "API Reference"}
                </Typography>
                <Chip size="small" label="OpenAPI v3" sx={{ fontWeight: 700 }} />
              </Stack>
              <Typography color="text.secondary" sx={{ maxWidth: 980 }}>
                {isPt
                  ? "Exemplos de request/response baseados no Swagger da API (schemas oficiais)."
                  : "Request/response examples based on the API Swagger (official schemas)."}
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <Button component="a" href={`${baseUrl}/swagger/index.html`} target="_blank" rel="noreferrer" variant="contained">
                  {isPt ? "Abrir Swagger" : "Open Swagger"}
                </Button>
                <Button component="a" href={`${baseUrl}/swagger/v1/swagger.json`} target="_blank" rel="noreferrer" variant="outlined">
                  {isPt ? "Baixar swagger.json" : "Open swagger.json"}
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
                  {isPt ? "Autenticação" : "Authentication"}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  {isPt
                    ? "A API suporta dois modos: X-API-Key (server-to-server) e Bearer JWT (usuário logado)."
                    : "The API supports two modes: X-API-Key (server-to-server) and Bearer JWT (logged-in user)."}
                </Typography>

                <Stack spacing={1} sx={{ mt: 1.5 }}>
                  <CodeBlock
                    title="Headers"
                    code={`Accept-Language: ${isPt ? "pt-BR" : "en"}\nX-API-Key: sk_live_...\nAuthorization: Bearer <token> (optional, app-only)`}
                  />
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h5" sx={{ fontWeight: 900 }}>
                  Pdf
                </Typography>

                <Stack spacing={2} sx={{ mt: 1.25 }}>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
                      <Chip size="small" label="POST" color="primary" />
                      <Typography sx={{ fontWeight: 900 }}>/api/Pdf/process</Typography>
                      <Chip size="small" label="multipart/form-data" variant="outlined" />
                      <Chip size="small" label="200: ProcessResponse" variant="outlined" />
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                      {isPt
                        ? "Cria um job assíncrono e retorna URLs para status/download."
                        : "Creates an async job and returns status/download URLs."}
                    </Typography>
                    <CodeBlock
                      title={isPt ? "Request (cURL)" : "Request (cURL)"}
                      code={`curl -X POST ${baseUrl}/api/Pdf/process \\\n+  -H "X-API-Key: sk_live_..." \\\n+  -H "Content-Type: multipart/form-data" \\\n+  -F "File=@document.pdf"`}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {isPt ? "Response (application/json):" : "Response (application/json):"}
                    </Typography>
                    <CodeBlock title="ProcessResponse" code={processResponseExample} />
                  </Box>

                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
                      <Chip size="small" label="POST" color="primary" />
                      <Typography sx={{ fontWeight: 900 }}>/api/Pdf/demo</Typography>
                      <Chip size="small" label="multipart/form-data" variant="outlined" />
                      <Chip size="small" label="200: ProcessResponse" variant="outlined" />
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                      {isPt
                        ? "Endpoint de demonstração (pode ter limites)."
                        : "Demo endpoint (may have limits)."}
                    </Typography>
                    <CodeBlock
                      title="Request (cURL)"
                      code={`curl -X POST ${baseUrl}/api/Pdf/demo \\\n+  -H "Content-Type: multipart/form-data" \\\n+  -F "File=@document.pdf"`}
                    />
                  </Box>

                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
                      <Chip size="small" label="POST" color="primary" />
                      <Typography sx={{ fontWeight: 900 }}>/api/Pdf/process-sync</Typography>
                      <Chip size="small" label="multipart/form-data" variant="outlined" />
                      <Chip size="small" label="200: PDF (binary)" variant="outlined" />
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                      {isPt
                        ? "Retorna o PDF processado diretamente (binário)."
                        : "Returns the processed PDF directly (binary)."}
                    </Typography>
                    <CodeBlock
                      title="Request (cURL)"
                      code={`curl -X POST ${baseUrl}/api/Pdf/process-sync \\\n+  -H "X-API-Key: sk_live_..." \\\n+  -H "Content-Type: multipart/form-data" \\\n+  -F "File=@document.pdf" \\\n+  -o result.pdf`}
                    />
                  </Box>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h5" sx={{ fontWeight: 900 }}>
                  Jobs
                </Typography>
                <Stack spacing={2} sx={{ mt: 1.25 }}>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
                      <Chip size="small" label="GET" />
                      <Typography sx={{ fontWeight: 900 }}>/api/Jobs/{"{jobId}"}/status</Typography>
                      <Chip size="small" label="200: JobStatusResponse" variant="outlined" />
                    </Stack>
                    <CodeBlock
                      title="Response example"
                      code={jobStatusExample}
                    />
                  </Box>

                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
                      <Chip size="small" label="GET" />
                      <Typography sx={{ fontWeight: 900 }}>/api/Jobs/{"{jobId}"}/download</Typography>
                      <Chip size="small" label="200: PDF (binary)" variant="outlined" />
                    </Stack>
                    <CodeBlock
                      title="Request (cURL)"
                      code={`curl -L ${baseUrl}/api/Jobs/9b7a0c1c2b3d4e5f/download \\\n+  -H "X-API-Key: sk_live_..." \\\n+  -o result.pdf`}
                    />
                  </Box>
                </Stack>
                
                <Divider sx={{ my: 2 }} />

                <Typography variant="h5" sx={{ fontWeight: 900 }}>
                  {isPt ? "Erros" : "Errors"}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                  {isPt
                    ? "Alguns endpoints retornam ErrorResponse (400/500) e outros retornam ProblemDetails (ex.: 401/404 em alguns recursos)."
                    : "Some endpoints return ErrorResponse (400/500) while others return ProblemDetails (e.g., 401/404 for some resources)."}
                </Typography>
                <CodeBlock title="ErrorResponse" code={errorResponseExample} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>
                    {isPt ? "Links úteis" : "Useful links"}
                  </Typography>
                  <Stack spacing={1} sx={{ mt: 1.25 }}>
                    <Button component="a" href={`${baseUrl}/swagger/index.html`} target="_blank" rel="noreferrer" variant="outlined" sx={{ justifyContent: "flex-start" }}>
                      {isPt ? "Swagger UI" : "Swagger UI"}
                    </Button>
                    <Button component="a" href={`${baseUrl}/swagger/v1/swagger.json`} target="_blank" rel="noreferrer" variant="outlined" sx={{ justifyContent: "flex-start" }}>
                      OpenAPI (swagger.json)
                    </Button>
                    <Button component="a" href={`${baseUrl}/ocr-status`} target="_blank" rel="noreferrer" variant="outlined" sx={{ justifyContent: "flex-start" }}>
                      /ocr-status
                    </Button>
                    <Button component="a" href={`${baseUrl}/`} target="_blank" rel="noreferrer" variant="outlined" sx={{ justifyContent: "flex-start" }}>
                      / (health)
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>
                    {isPt ? "Notas" : "Notes"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {isPt
                      ? "Alguns schemas do Swagger marcam download como application/json + binary. Na prática, trate como download de PDF (application/pdf)."
                      : "Some Swagger schemas describe downloads as application/json + binary. In practice, treat them as PDF downloads (application/pdf)."}
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>

      </Container>
    </Box>
  );
}
