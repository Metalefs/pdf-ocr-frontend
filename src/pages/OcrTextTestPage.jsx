import { useMemo, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import UploadZone from "../components/UploadZone";
import ErrorBox from "../components/ErrorBox";

import { useAuth } from "../contexts/AuthContext";
import { useI18n } from "../i18n";

import { processPdfText, processPdfTextDemo } from "../services/pdf.service";

export default function OcrTextTestPage({ onRequireAuth }) {
  const { t } = useI18n();
  const auth = useAuth();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [requireAuthForNext, setRequireAuthForNext] = useState(false);

  const isAuthGated = !auth.user && requireAuthForNext;

  const sizeWarning = useMemo(() => {
    if (!file) return null;
    if (auth.user) return null;
    if (file.size <= 1_000_000) return null;
    return t("errors.demoSize") || "Demo is limited to 1MB. Sign in to process larger files.";
  }, [auth.user, file, t]);

  async function handleRun() {
    if (!file) return;

    if (isAuthGated) {
      onRequireAuth?.(t('authDialog.message') || 'Demo limit reached. Sign in to continue.');
      return;
    }

    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const data = auth.user ? await processPdfText(file) : await processPdfTextDemo(file);
      setResult(data);
    } catch (err) {
      if (err && (err.status === 429 || err.code === 'DEMO_LIMIT')) {
        setRequireAuthForNext(true);
        onRequireAuth?.(err.details || (t('authDialog.message') || 'Demo limit reached. Sign in to continue.'));
      }
      setError(err && err.message ? { message: err.message, details: err.details, upgradeUrl: err.upgradeUrl } : err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ bgcolor: "background.default", py: { xs: 3, md: 5 } }}>
      <Container maxWidth="md">
        <Stack spacing={2}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -0.5 }}>
              {t('tools.text.title') || 'Extract text from a PDF'}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              {t('tools.text.subtitle') || 'Runs OCR and returns the extracted text (JSON).'}
            </Typography>
          </Box>

          <UploadZone file={file} onSelect={(f) => { setFile(f); setResult(null); setError(null); }} />

          {sizeWarning ? (
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {sizeWarning}
                </Typography>
              </CardContent>
            </Card>
          ) : null}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }}>
            <Button
              variant="contained"
              disabled={!file || loading}
              onClick={handleRun}
              sx={{ textTransform: 'none', fontWeight: 800 }}
            >
              {loading ? (t('process.syncing') || 'Processing...') : (t('tools.text.button') || 'Run OCR → Text')}
            </Button>
            <Typography variant="body2" color="text.secondary">
              {!auth.user ? (t('tools.text.demoNote') || 'Demo: 1MB limit and 3 calls/24h per IP.') : (t('tools.text.authNote') || 'Authenticated: uses your credits.')}
            </Typography>
          </Stack>

          {error ? <ErrorBox error={error} /> : null}

          {result ? (
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack spacing={1.5}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 900 }}>
                      {t('tools.text.resultTitle') || 'Extracted text'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                      {typeof result.pageCount === 'number' ? `${result.pageCount} page(s)` : null}
                    </Typography>
                  </Stack>

                  <Divider />

                  <Box
                    component="pre"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      m: 0,
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: 'action.hover',
                      maxHeight: 420,
                      overflow: 'auto',
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                      fontSize: 13,
                    }}
                  >
                    {String(result.text || '').trim() || (t('tools.text.empty') || '[No text extracted]')}
                  </Box>

                  <Button
                    variant="outlined"
                    sx={{ alignSelf: 'flex-start', textTransform: 'none' }}
                    onClick={async () => {
                      const text = String(result.text || '');
                      try {
                        await navigator.clipboard.writeText(text);
                      } catch {
                        // ignore
                      }
                    }}
                  >
                    {t('tools.text.copy') || 'Copy'}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ) : null}
        </Stack>
      </Container>
    </Box>
  );
}
