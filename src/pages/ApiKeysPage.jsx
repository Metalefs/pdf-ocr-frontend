import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/auth.service';
import { withLanguageHeaders } from '../services/api';
import { useI18n } from '../i18n';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ApiKeysPage() {
  const { user } = useAuth();
  const { t, locale } = useI18n();
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKey, setNewKey] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const [revokeDialog, setRevokeDialog] = useState({ open: false, keyId: null, keyName: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const dateFormatter = useMemo(() => {
    try {
      return new Intl.DateTimeFormat(locale || undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }
  }, [locale]);

  const loadKeys = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    try {
      setError(null);
      const session = await supabase.auth.getSession();
      const res = await fetch(`${API_BASE}/api/ApiKeys`, {
        headers: withLanguageHeaders({
          headers: {
            Authorization: `Bearer ${session.data.session.access_token}`
          }
        }).headers
      });

      if (res.ok) {
        const data = await res.json();
        setKeys(data);
      } else {
        setError(t('errors.generic'));
      }
    } catch (err) {
      console.error('Erro ao carregar chaves:', err);
      setError(err?.message || t('errors.generic'));
    } finally {
      if (!silent) setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (user) {
      void loadKeys();
    }
  }, [user, loadKeys]);

  const createKey = async (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    setCreating(true);
    try {
      setError(null);
      const session = await supabase.auth.getSession();
      const res = await fetch(`${API_BASE}/api/ApiKeys`, {
        method: 'POST',
        headers: withLanguageHeaders({
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.data.session.access_token}`
          },
        }).headers,
        body: JSON.stringify({ 
          name: newKeyName,
          rateLimitPerMinute: 60
        })
      });

      if (res.ok) {
        const data = await res.json();
        setNewKey(data.plainKey); // Mostrar APENAS uma vez
        setNewKeyName('');
        await loadKeys({ silent: true });
      } else {
        const details = await res.text().catch(() => '');
        setError(details || t('errors.generic'));
      }
    } catch (err) {
      console.error('Erro ao criar chave:', err);
      setError(err?.message || t('errors.generic'));
    } finally {
      setCreating(false);
    }
  };

  const revokeKey = async (keyId) => {
    try {
      setError(null);
      const session = await supabase.auth.getSession();
      const res = await fetch(`${API_BASE}/api/ApiKeys/${keyId}`, {
        method: 'DELETE',
        headers: withLanguageHeaders({
          headers: {
            Authorization: `Bearer ${session.data.session.access_token}`
          }
        }).headers
      });

      if (res.ok) {
        await loadKeys({ silent: true });
        setSnackbar({ open: true, message: 'Key revoked', severity: 'success' });
      } else {
        const details = await res.text().catch(() => '');
        setError(details || t('errors.generic'));
      }
    } catch (err) {
      console.error('Erro ao revogar:', err);
      setError(err?.message || t('errors.generic'));
    }
  };

  const copyKey = async () => {
    try {
      await navigator.clipboard.writeText(newKey);
      setCopied(true);
      setSnackbar({ open: true, message: t('apiKeys.copied'), severity: 'success' });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Clipboard copy failed', err);
      setSnackbar({ open: true, message: 'Copy failed', severity: 'error' });
    }
  };

  const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return dateFormatter.format(date);
  };

  if (!user) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Alert severity="info">{t('apiKeys.loginRequired')}</Alert>
      </Box>
    );
  }

  // Check if user is on free plan
  if (user.plan.toLowerCase() === 'free') {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Alert severity="warning" sx={{ maxWidth: 500 }}>
          {t('apiKeys.freePlanMessage')}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', py: { xs: 3, md: 4 } }}>
      <Container maxWidth="md">
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              {t('apiKeys.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              {t('apiKeys.description')}
            </Typography>
          </Box>

          {error ? <Alert severity="error">{error}</Alert> : null}

          {newKey ? (
            <Card variant="outlined" sx={{ borderRadius: 3, borderColor: 'warning.main' }}>
              <CardContent>
                <Stack spacing={1.25}>
                  <Alert severity="warning" sx={{ alignItems: 'center' }}>
                    <strong>{t('apiKeys.alertTitle')}</strong>  {t('apiKeys.alertDescription')}
                  </Alert>

                  <Box
                    component="pre"
                    sx={(theme) => ({
                      m: 0,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      fontFamily:
                        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                      fontSize: '0.875rem',
                      overflowX: 'auto',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                    })}
                  >
                    {newKey}
                  </Box>
                </Stack>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={copyKey}
                  startIcon={<ContentCopyIcon />}
                  sx={{ textTransform: 'none' }}
                >
                  {copied ? t('apiKeys.copied') : t('apiKeys.copy')}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setNewKey(null)}
                  sx={{ textTransform: 'none' }}
                >
                  {t('apiKeys.okSaved')}
                </Button>
              </CardActions>
            </Card>
          ) : null}

          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {t('apiKeys.createTitle')}
                </Typography>
                <Box component="form" onSubmit={createKey} sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                  <TextField
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder={t('apiKeys.createPlaceholder')}
                    label={t('apiKeys.createTitle')}
                    size="small"
                    fullWidth
                    sx={{ flex: '1 1 320px' }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={creating || !newKeyName.trim()}
                    startIcon={creating ? <CircularProgress size={16} color="inherit" /> : null}
                    sx={{ textTransform: 'none', minWidth: 140 }}
                  >
                    {creating ? t('apiKeys.creating') : t('apiKeys.createButton')}
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack spacing={1.5}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {t('apiKeys.activeKeys')}
                </Typography>
                <Divider />

                {loading ? (
                  <Stack spacing={1} alignItems="center" sx={{ py: 3 }}>
                    <CircularProgress size={22} />
                    <Typography variant="body2" color="text.secondary">{t('apiKeys.loading')}</Typography>
                  </Stack>
                ) : keys.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                    {t('apiKeys.noKeys')}
                  </Typography>
                ) : (
                  <List disablePadding>
                    {keys.map((key, idx) => {
                      const createdText = formatDate(key.createdAt);
                      const lastUsedText = formatDate(key.lastUsedAt);
                      const masked = `sk_live_••••••••${key.id?.toString?.().slice(-8)}`;

                      const secondaryLines = [
                        createdText ? `Created ${createdText}` : null,
                        lastUsedText ? `Last used ${lastUsedText}` : null,
                        masked,
                      ].filter(Boolean);

                      return (
                        <ListItem
                          key={key.id}
                          divider={idx !== keys.length - 1}
                          sx={{ py: 1.25, pr: 9 }}
                        >
                          <ListItemText
                            primary={
                              <Typography sx={{ fontWeight: 700 }}>
                                {key.name}
                              </Typography>
                            }
                            secondary={
                              <Stack spacing={0.25} sx={{ mt: 0.25 }}>
                                {secondaryLines.map((line, lineIdx) => (
                                  <Typography
                                    key={lineIdx}
                                    variant={lineIdx === secondaryLines.length - 1 ? 'caption' : 'body2'}
                                    color={lineIdx === secondaryLines.length - 1 ? 'text.disabled' : 'text.secondary'}
                                    sx={{
                                      fontFamily:
                                        lineIdx === secondaryLines.length - 1
                                          ? 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
                                          : undefined,
                                    }}
                                  >
                                    {line}
                                  </Typography>
                                ))}
                              </Stack>
                            }
                          />

                          <ListItemSecondaryAction>
                            <Tooltip title={t('apiKeys.revoke')}>
                              <IconButton
                                edge="end"
                                color="error"
                                onClick={() => setRevokeDialog({ open: true, keyId: key.id, keyName: key.name })}
                                aria-label={t('apiKeys.revoke')}
                              >
                                <DeleteOutlineIcon />
                              </IconButton>
                            </Tooltip>
                          </ListItemSecondaryAction>
                        </ListItem>
                      );
                    })}
                  </List>
                )}
              </Stack>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack spacing={1.25}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {t('apiKeys.howTo.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('apiKeys.howTo.authHeader')}
                </Typography>

                <Box
                  component="pre"
                  sx={(theme) => ({
                    m: 0,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    fontFamily:
                      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                    fontSize: '0.875rem',
                    overflowX: 'auto',
                  })}
                >
                  {t('apiKeys.howTo.curlExample', { base: API_BASE })}
                </Box>
                <Box
                  component="pre"
                  sx={(theme) => ({
                    m: 0,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    fontFamily:
                      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                    fontSize: '0.875rem',
                    overflowX: 'auto',
                  })}
                >
                  {t('apiKeys.howTo.jsExample', { base: API_BASE })}
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Stack>

        <Dialog
          open={revokeDialog.open}
          onClose={() => setRevokeDialog({ open: false, keyId: null, keyName: '' })}
          aria-labelledby="revoke-key-title"
        >
          <DialogTitle id="revoke-key-title">{t('apiKeys.revoke')}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {`Revoke key "${revokeDialog.keyName}"?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setRevokeDialog({ open: false, keyId: null, keyName: '' })}
              sx={{ textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={async () => {
                const keyId = revokeDialog.keyId;
                setRevokeDialog({ open: false, keyId: null, keyName: '' });
                if (keyId != null) await revokeKey(keyId);
              }}
              sx={{ textTransform: 'none' }}
            >
              {t('apiKeys.revoke')}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}