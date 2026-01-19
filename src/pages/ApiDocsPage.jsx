import { useEffect } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import CodeBlock from "../components/CodeBlock";

import { useI18n } from "../i18n";

function setMetaDescription(content) {
  const tag = document.querySelector('meta[name="description"]');
  if (tag) tag.setAttribute("content", content);
}

export default function ApiDocsPage() {
  const { locale } = useI18n();
  const isPt = String(locale).toLowerCase().startsWith("pt");

  const baseUrl = (import.meta?.env?.VITE_API_BASE || import.meta?.env?.VITE_API_URL || "https://pdf-ocr-api-production.up.railway.app").replace(/\/$/, "");

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
    document.title = isPt ? "API  TextLayer OCR" : "API  TextLayer OCR";
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
            <Stack spacing={1.5}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "flex-start", sm: "center" }}>
                <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -0.5, lineHeight: 1.1 }}>
                  {isPt ? "Referência da API" : "API Reference"}
                </Typography>
                <Chip size="small" label="OpenAPI v3" sx={{ fontWeight: 700 }} />
              </Stack>
              <Typography color="text.secondary" sx={{ maxWidth: 980 }}>
                {isPt
                  ? "Endpoints + exemplos mínimos. Detalhes completos no Swagger."
                  : "Endpoints + minimal examples. Full details in Swagger."}
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <Button component="a" href={`${baseUrl}/swagger/index.html`} target="_blank" rel="noreferrer" variant="outlined" size="small">
                  {isPt ? "Swagger UI" : "Swagger UI"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Stack spacing={2.5}>
              <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Typography variant="h5" sx={{ fontWeight: 900 }}>
                    {isPt ? "Autenticação" : "Authentication"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {isPt
                      ? "Use o header X-API-Key com a chave ativa. Em staging, prefira chaves de teste."
                      : "Send X-API-Key with your active key. Use test keys on staging."}
                  </Typography>
                  <Divider />
                  <Typography variant="body2" color="text.secondary">
                    {isPt
                      ? "Todas as respostas são JSON, exceto downloads de PDF (application/pdf)."
                      : "All responses are JSON except PDF downloads (application/pdf)."}
                  </Typography>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Stack spacing={1.25}>
                    <Typography variant="h5" sx={{ fontWeight: 900 }}>
                      {isPt ? "Endpoints" : "Endpoints"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {isPt
                        ? "Expanda para ver chamadas principais, payloads e exemplos."
                        : "Expand to see main calls, payloads, and examples."}
                    </Typography>

                    <Accordion expanded variant="outlined" disableGutters sx={{ borderRadius: 2, overflow: "hidden" }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
                          <Typography sx={{ fontWeight: 900 }}>Pdf</Typography>
                          <Chip size="small" label="POST /api/Pdf/process" color="primary" variant="outlined" />
                          <Chip size="small" label="POST /api/Pdf/process-sync" variant="outlined" />
                          <Chip size="small" label="POST /api/Pdf/demo" variant="outlined" />
                        </Stack>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Stack spacing={2}>
                          <Box>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
                              <Chip size="small" label="POST" color="primary" />
                              <Typography sx={{ fontWeight: 900 }}>/api/Pdf/process</Typography>
                              <Chip size="small" label="multipart/form-data" variant="outlined" />
                              <Chip size="small" label="200: ProcessResponse" variant="outlined" />
                            </Stack>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                              {isPt
                                ? "Cria um job assíncrono e retorna URLs de status/download."
                                : "Creates an async job and returns status/download URLs."}
                            </Typography>
                            <CodeBlock
                              title="Request (cURL)"
                              code={`curl -X POST ${baseUrl}/api/Pdf/process \\
  -H "X-API-Key: sk_live_..." \\
  -H "Content-Type: multipart/form-data" \\
  -F "File=@document.pdf"`}
                            />
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              {isPt ? "Response (application/json):" : "Response (application/json):"}
                            </Typography>
                            <CodeBlock title="ProcessResponse" code={processResponseExample} />
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
                      </AccordionDetails>
                    </Accordion>
                    <Accordion variant="outlined" disableGutters sx={{ borderRadius: 2, overflow: "hidden" }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
                          <Typography sx={{ fontWeight: 900 }}>Jobs</Typography>
                          <Chip size="small" label="GET /api/Jobs/{jobId}/status" variant="outlined" />
                        </Stack>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Stack spacing={2}>
                          <Box>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
                              <Chip size="small" label="GET" color="primary" />
                              <Typography sx={{ fontWeight: 900 }}>/api/Jobs/{"{jobId}"}/status</Typography>
                              <Chip size="small" label="200: JobStatus" variant="outlined" />
                            </Stack>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                              {isPt ? "Consulta status do job." : "Checks job status."}
                            </Typography>
                            <CodeBlock
                              title="Request (cURL)"
                              code={`curl -L ${baseUrl}/api/Jobs/9b7a0c1c2b3d4e5f/status \\
  -H "X-API-Key: sk_live_..."`}
                            />
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              {isPt ? "Response (application/json):" : "Response (application/json):"}
                            </Typography>
                            <CodeBlock title="Response example" code={jobStatusExample} />
                          </Box>
                        </Stack>
                      </AccordionDetails>
                    </Accordion>

                    <Accordion variant="outlined" disableGutters sx={{ borderRadius: 2, overflow: "hidden" }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
                          <Typography sx={{ fontWeight: 900 }}>{isPt ? "Erros" : "Errors"}</Typography>
                          <Chip size="small" label="ErrorResponse" variant="outlined" />
                        </Stack>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.25 }}>
                          {isPt
                            ? "Alguns endpoints retornam ErrorResponse (400/500) e outros retornam ProblemDetails (401/404 em alguns recursos)."
                            : "Some endpoints return ErrorResponse (400/500) and others return ProblemDetails (401/404 on some resources)."}
                        </Typography>
                        <CodeBlock title="ErrorResponse" code={errorResponseExample} />
                      </AccordionDetails>
                    </Accordion>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
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
                      Swagger UI
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
