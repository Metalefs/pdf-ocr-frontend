import { useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useI18n } from "../i18n";

function setMetaDescription(content) {
  const tag = document.querySelector('meta[name="description"]');
  if (tag) tag.setAttribute("content", content);
}

export default function DocsPage() {
  const { locale } = useI18n();
  const isPt = String(locale).toLowerCase().startsWith("pt");

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
    <Box sx={{ bgcolor: "background.default", py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -0.5 }}>
            {isPt ? "Documentação" : "Documentation"}
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 980 }}>
            {isPt
              ? "Guia rápido da plataforma e da API para processar PDFs."
              : "Quick guide to the platform and API for processing PDFs."}
          </Typography>
        </Stack>

        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>
                  {isPt ? "Como funciona" : "How it works"}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  {isPt
                    ? "Envie um PDF (multipart/form-data) para o endpoint de processamento. O backend cria um job assíncrono, você acompanha o status e baixa o arquivo final quando estiver pronto."
                    : "Upload a PDF (multipart/form-data) to the processing endpoint. The backend creates an async job, you poll status and download the final PDF when ready."}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {isPt ? "Autenticação" : "Authentication"}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                  {isPt
                    ? "A API suporta autenticação via API key (header X-API-Key)."
                    : "The API supports API key authentication (X-API-Key header)."}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {isPt ? "Endpoints principais" : "Main endpoints"}
                </Typography>
                <Stack spacing={1} sx={{ mt: 1 }}>
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>
                      POST /api/Pdf/process
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {isPt
                        ? "Processamento assíncrono (recomendado). Retorna jobId, statusUrl e downloadUrl."
                        : "Asynchronous processing (recommended). Returns jobId, statusUrl, downloadUrl."}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>
                      POST /api/Pdf/process-sync
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {isPt
                        ? "Processamento síncrono para fluxos simples."
                        : "Synchronous processing for simpler flows."}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>
                      GET /api/jobs/{"{jobId}"}/status
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {isPt
                        ? "Acompanha progresso e estado do job (queued/processing/completed/failed)."
                        : "Polls job progress and state (queued/processing/completed/failed)."}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>
                      GET /api/jobs/{"{jobId}"}/download
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {isPt
                        ? "Baixa o PDF processado quando o job estiver concluído."
                        : "Downloads the processed PDF when the job is completed."}
                    </Typography>
                  </Box>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {isPt ? "Exemplo (cURL)" : "Example (cURL)"}
                </Typography>
                <Box
                  component="pre"
                  sx={{
                    mt: 1,
                    p: 2,
                    bgcolor: "action.hover",
                    borderRadius: 2,
                    overflowX: "auto",
                    fontSize: 13,
                    lineHeight: 1.45,
                    border: 1,
                    borderColor: "divider",
                  }}
                >
                  <code>{`curl -X POST https://YOUR_API/api/Pdf/process \\\n  -H "X-API-Key: sk_live_..." \\\n  -H "Content-Type: multipart/form-data" \\\n  -F "file=@document.pdf"`}</code>
                </Box>

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
                      ? "Use o modo assíncrono para lotes, trate timeouts e cacheie resultados por hash do arquivo quando fizer sentido."
                      : "Use async mode for batches, handle timeouts, and cache results by file hash when appropriate."}
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
  );
}
