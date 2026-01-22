import { useState } from "react";
import { useI18n } from '../i18n';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import { alpha } from "@mui/material/styles";

import EmailIcon from "@mui/icons-material/Email";
import BugReportIcon from "@mui/icons-material/BugReport";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import BusinessIcon from "@mui/icons-material/Business";
import SendIcon from "@mui/icons-material/Send";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MenuBookIcon from "@mui/icons-material/MenuBook";

export default function ContactPage() {
  const { t } = useI18n();
  const email = 'contact@textlayerocr.com';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    type: 'support',
    message: '',
    browserInfo: '',
    errorDetails: '',
  });
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Coletar informações do navegador se for bug report
    let emailBody = `Name: ${formData.name}\nEmail: ${formData.email}\nType: ${formData.type}\n\nMessage:\n${formData.message}`;
    
    if (formData.type === 'bug') {
      const browserInfo = `Browser: ${navigator.userAgent}\nScreen: ${window.screen.width}x${window.screen.height}\nLanguage: ${navigator.language}`;
      emailBody += `\n\nBrowser Information:\n${browserInfo}`;
      if (formData.errorDetails) {
        emailBody += `\n\nError Details:\n${formData.errorDetails}`;
      }
    }
    
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
    
    setSnackbar({
      open: true,
      message: t('contact.form.emailClientOpened'),
      severity: 'success'
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      type: 'support',
      message: '',
      browserInfo: '',
      errorDetails: '',
    });
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        sx={(theme) => ({
          position: "relative",
          overflow: "hidden",
          py: { xs: 0, md: 2 },
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          borderBottom: `1px solid ${theme.palette.divider}`,
        })}
      >
        <Container maxWidth="lg">
          <Stack spacing={2} alignItems="center" textAlign="center">
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                letterSpacing: -1,
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t('contact.title')}
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ maxWidth: 600, fontWeight: 400 }}
            >
              {t('contact.subtitle')}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Chip
                icon={<AccessTimeIcon />}
                label={t('contact.responseTime')}
                color="primary"
                variant="outlined"
              />
              <Chip
                icon={<EmailIcon />}
                label={email}
                color="primary"
                variant="filled"
              />
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={2} sx={{ display: 'flex', alignItems: 'stretch' }}>
          {/* Contact Options */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Card
                variant="outlined"
                sx={(theme) => ({
                  borderRadius: 4,
                  transition: "all 0.3s ease",
                  border: `2px solid ${theme.palette.divider}`,
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    transform: "translateY(-4px)",
                    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                  },
                })}
              >
                <CardContent sx={{ p: 2 }}>
                  <Stack spacing={2.5}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                          color: "primary.main",
                          flexShrink: 0,
                        }}
                      >
                        <EmailIcon sx={{ fontSize: 28 }} />
                      </Avatar>
                      <Box sx={{ flex: 1, textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                          {t('contact.options.email.title')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t('contact.options.email.description')}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="contained"
                      href={`mailto:${email}`}
                      startIcon={<EmailIcon />}
                      sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        py: 1.25,
                      }}
                      fullWidth
                    >
                      {email}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              <Card
                variant="outlined"
                sx={(theme) => ({
                  borderRadius: 4,
                  transition: "all 0.3s ease",
                  border: `2px solid ${theme.palette.divider}`,
                  "&:hover": {
                    borderColor: theme.palette.info.main,
                    transform: "translateY(-4px)",
                    boxShadow: `0 8px 24px ${alpha(theme.palette.info.main, 0.15)}`,
                  },
                })}
              >
                <CardContent sx={{ p: 2 }}>
                  <Stack spacing={2.5}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                          color: "info.main",
                          flexShrink: 0,
                        }}
                      >
                        <MenuBookIcon sx={{ fontSize: 28 }} />
                      </Avatar>
                      <Box sx={{ flex: 1, textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                          {t('contact.options.support.title')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t('contact.options.support.description')}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="outlined"
                      href="/docs"
                      startIcon={<MenuBookIcon />}
                      sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        py: 1.25,
                      }}
                      fullWidth
                    >
                      {t('contact.options.support.button')}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              <Card
                variant="outlined"
                sx={(theme) => ({
                  borderRadius: 4,
                  transition: "all 0.3s ease",
                  border: `2px solid ${theme.palette.divider}`,
                  "&:hover": {
                    borderColor: theme.palette.success.main,
                    transform: "translateY(-4px)",
                    boxShadow: `0 8px 24px ${alpha(theme.palette.success.main, 0.15)}`,
                  },
                })}
              >
                <CardContent sx={{ p: 2 }}>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
                          color: "success.main",
                          flexShrink: 0,
                        }}
                      >
                        <BusinessIcon sx={{ fontSize: 28 }} />
                      </Avatar>
                      <Box sx={{ flex: 1, textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                          {t('contact.options.business.title')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                          {t('contact.options.business.description')}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Chip
                            icon={<AccessTimeIcon />}
                            label={t('contact.options.business.response')}
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

            </Stack>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={(theme) => ({
                borderRadius: 4,
                p: { xs: 3, md: 4 },
                border: `2px solid ${theme.palette.divider}`,
                background: theme.palette.background.paper,
              })}
            >
              <Stack spacing={2}>
                <Box>
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0 }}>
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                        color: "primary.main",
                      }}
                    >
                      <SendIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -0.5 }}>
                        {t('contact.form.title')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('contact.form.description')}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Divider />

                <form onSubmit={handleSubmit}>
                  <Stack spacing={2.5}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          required
                          label={t('contact.form.name')}
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          required
                          type="email"
                          label={t('contact.form.email')}
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>

                    <FormControl fullWidth required>
                      <InputLabel>{t('contact.form.type.label')}</InputLabel>
                      <Select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        label={t('contact.form.type.label')}
                      >
                        <MenuItem value="support">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <HelpOutlineIcon fontSize="small" />
                            {t('contact.form.type.support')}
                          </Box>
                        </MenuItem>
                        <MenuItem value="bug">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BugReportIcon fontSize="small" />
                            {t('contact.form.type.bug')}
                          </Box>
                        </MenuItem>
                        <MenuItem value="feature">
                          {t('contact.form.type.feature')}
                        </MenuItem>
                        <MenuItem value="business">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BusinessIcon fontSize="small" />
                            {t('contact.form.type.business')}
                          </Box>
                        </MenuItem>
                        <MenuItem value="other">
                          {t('contact.form.type.other')}
                        </MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      fullWidth
                      required
                      label={t('contact.form.subject')}
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      variant="outlined"
                      placeholder={formData.type === 'bug' ? t('contact.form.subjectPlaceholder.bug') : t('contact.form.subjectPlaceholder.default')}
                    />

                    {formData.type === 'bug' && (
                      <Alert severity="info" icon={<BugReportIcon />}>
                        <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
                          {t('contact.form.bugReport.title')}
                        </Typography>
                        <Typography variant="caption">
                          {t('contact.form.bugReport.description')}
                        </Typography>
                      </Alert>
                    )}

                    <TextField
                      fullWidth
                      required
                      multiline
                      rows={6}
                      label={t('contact.form.message')}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      variant="outlined"
                      placeholder={formData.type === 'bug' ? t('contact.form.messagePlaceholder.bug') : t('contact.form.messagePlaceholder.default')}
                    />

                    {formData.type === 'bug' && (
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label={t('contact.form.errorDetails')}
                        name="errorDetails"
                        value={formData.errorDetails}
                        onChange={handleChange}
                        variant="outlined"
                        placeholder={t('contact.form.errorDetailsPlaceholder')}
                        helperText={t('contact.form.errorDetailsHelper')}
                      />
                    )}

                    <Divider />

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        startIcon={<SendIcon />}
                        sx={{
                          textTransform: "none",
                          fontWeight: 700,
                          py: 1.5,
                          px: 4,
                          boxShadow: 3,
                          "&:hover": {
                            boxShadow: 6,
                          },
                        }}
                      >
                        {t('contact.form.submit')}
                      </Button>
                      <Button
                        type="button"
                        variant="outlined"
                        size="large"
                        onClick={() => setFormData({
                          name: '',
                          email: '',
                          subject: '',
                          type: 'support',
                          message: '',
                          browserInfo: '',
                          errorDetails: '',
                        })}
                        sx={{
                          textTransform: "none",
                          py: 1.5,
                          px: 4,
                        }}
                      >
                        {t('contact.form.clear')}
                      </Button>
                    </Stack>
                  </Stack>
                </form>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
