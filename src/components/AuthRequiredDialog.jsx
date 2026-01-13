import React from 'react';
import { useI18n } from '../i18n';
import { useNavigate } from 'react-router-dom';

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function AuthRequiredDialog({ isOpen, onClose, onSignIn, message }) {
  const { t } = useI18n();
  const navigate = useNavigate();

  return (
    <Dialog
      open={Boolean(isOpen)}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{t('authDialog.title') || 'Sign In Required'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 0.5 }}>
          <Typography color="text.secondary">
            {message || (t('authDialog.message') || 'You have reached the demo limit. Create a free account to continue processing PDFs or upgrade to a paid plan for unlimited access.')}
          </Typography>

          <Alert severity="info">
            {t('authDialog.benefits') || 'Free account includes 10 credits per month'}
          </Alert>

          <Box />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          {t('authDialog.cancel') || 'Cancel'}
        </Button>
        <Button onClick={() => navigate('/plans')} variant="outlined">
          {t('authDialog.viewPlans') || 'View Plans & Pricing'}
        </Button>
        <Button onClick={onSignIn} variant="contained">
          {t('authDialog.signIn') || 'Sign In / Create Account'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
