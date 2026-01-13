// src/pages/PlansPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { paymentService } from '../services/payment.service';
import { stripePromise } from '../config/stripe';
import { useI18n } from '../i18n';

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function PlansPage({ onNavigate }) {
  const { user, credits } = useAuth();
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setError(null);
        const fetchedPlans = await paymentService.getPlans();
        setPlans(fetchedPlans);
      } catch (err) {
        setError(err.message || 'Failed to load plans');
        console.error('Error fetching plans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const formatPrice = (amount, currency) => {
    const numericAmount = Number(amount);
    const safeCurrency = (currency || 'USD').toUpperCase();
    if (!Number.isFinite(numericAmount)) return '';
    try {
      return new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : 'en-US', {
        style: 'currency',
        currency: safeCurrency,
        minimumFractionDigits: numericAmount % 1 === 0 ? 0 : 2,
      }).format(numericAmount);
    } catch {
      return `${safeCurrency} ${numericAmount}`;
    }
  };

  const getFeatureLabels = (features) => {
    if (Array.isArray(features)) return features.filter(Boolean);
    if (!features || typeof features !== 'object') return [];

    return Object.entries(features)
      .filter(([, v]) => v === true)
      .map(([k]) => {
        const label = t(`plans.features.${k}`);
        return label && label !== `plans.features.${k}` ? label : k;
      });
  };

  const handleUpgrade = async (plan) => {
    if (!user) {
      alert('Please log in to upgrade your plan');
      return;
    }

    if (plan.id === 'free' || !plan.priceId) {
      alert('This plan does not support upgrading');
      return;
    }

    try {
      setCheckoutLoading(prev => ({ ...prev, [plan.id]: true }));
      
      const { sessionId, url } = await paymentService.createCheckoutSession(
        plan.id,
        plan.priceId
      );

      // Redirect to Stripe checkout
      if (url) {
        window.location.href = url;
      } else {
        // Fallback: use Stripe.js
        const stripe = await stripePromise;
        if (stripe) {
          await stripe.redirectToCheckout({ sessionId });
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to start checkout');
      console.error('Checkout error:', err);
    } finally {
      setCheckoutLoading(prev => ({ ...prev, [plan.id]: false }));
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography color="text.secondary">Loading plans…</Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', py: { xs: 3, md: 4 } }}>
      <Container maxWidth="lg">
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {t('plans.header')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              {t('plans.subtitle')}
            </Typography>
          </Box>

          {user ? (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'flex-start', sm: 'center' }}>
              <Chip
                color="primary"
                variant="outlined"
                label={`Current plan: ${user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}`}
              />
              {typeof credits?.credits === 'number' ? (
                <Chip
                  color="primary"
                  variant="filled"
                  label={`${credits.credits} credits`}
                />
              ) : null}
            </Stack>
          ) : (
            <Alert severity="info">
              Log in to upgrade your plan.
            </Alert>
          )}

          {error ? <Alert severity="error">{error}</Alert> : null}
        </Stack>

        <Grid container spacing={2}>
          {plans.map((plan) => {
            const planId = plan?.id ?? plan?.Id ?? '';
            const planName = plan?.name ?? plan?.Name ?? '';
            const planDescription = plan?.description ?? plan?.Description ?? '';
            const priceId = plan?.priceId ?? plan?.PriceId;
            const planCurrency = plan?.currency ?? plan?.Currency ?? 'USD';
            const planInterval = plan?.interval ?? plan?.Interval ?? 'month';
            const planCredits = Number(plan?.credits ?? plan?.Credits ?? 0);
            const planPopular = Boolean(plan?.popular ?? plan?.Popular);
            const planFeatures = plan?.features ?? plan?.Features;
            const featureLabels = getFeatureLabels(planFeatures);

            const slug = (planName || planId).toString().toLowerCase();
            const isCurrent = (user?.plan || '').toLowerCase() === slug;
            const isFree = slug === 'free' || (planName || '').toLowerCase() === 'free';
            const numericPrice = Number(plan?.price ?? plan?.Price ?? 0);
            const isPaid = Number.isFinite(numericPrice) && numericPrice > 0;
            const ctaDisabled = Boolean(
              checkoutLoading[planId] ||
              isCurrent ||
              !priceId
            );

            const ctaLabel = checkoutLoading[planId]
              ? 'Processing…'
              : isCurrent
                ? 'Current Plan'
                : isFree
                  ? 'Free Plan'
                  : 'Upgrade Now';

            return (
              <Grid key={planId || planName} item xs={12} md={6} lg={4}>
                <Card
                  variant="outlined"
                  sx={(theme) => ({
                    height: '100%',
                    borderRadius: 3,
                    borderColor: isCurrent ? theme.palette.primary.main : theme.palette.divider,
                    boxShadow: isCurrent ? theme.shadows[2] : 'none',
                  })}
                >
                  <CardContent>
                    <Stack spacing={2}>
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                          <Typography variant="h6" sx={{ fontWeight: 800 }}>
                            {planName}
                          </Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            {planPopular ? <Chip size="small" color="secondary" label="Popular" /> : null}
                            {isCurrent ? <Chip size="small" color="primary" label="Active" /> : null}
                          </Stack>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="baseline" sx={{ mt: 1 }}>
                          <Typography variant="h4" sx={{ fontWeight: 900 }}>
                            {isPaid ? formatPrice(numericPrice, planCurrency) : formatPrice(0, planCurrency)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            /{planInterval || 'month'}
                          </Typography>
                        </Stack>
                        {planDescription ? (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                            {planDescription}
                          </Typography>
                        ) : null}
                      </Box>

                      <Box>
                        <Typography variant="overline" color="text.secondary">
                          Credits
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                          {Number.isFinite(planCredits) ? planCredits : 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t('plans.credits.label', { count: Number.isFinite(planCredits) ? planCredits : 0 })}
                        </Typography>
                      </Box>

                      <Divider />

                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                          Features
                        </Typography>
                        <List dense disablePadding>
                          {featureLabels.map((feature, idx) => (
                            <ListItem key={idx} disableGutters sx={{ py: 0.25 }}>
                              <ListItemIcon sx={{ minWidth: 34 }}>
                                <CheckCircleOutlineIcon fontSize="small" color="success" />
                              </ListItemIcon>
                              <ListItemText primaryTypographyProps={{ variant: 'body2' }} primary={feature} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>

                      <Alert severity="info" sx={{ mt: 1 }}>
                        <strong>{t('plans.apiAccess')}:</strong>{' '}
                        {isPaid ? t('plans.apiIncludedYes') : t('plans.apiIncludedNo')}
                      </Alert>
                    </Stack>
                  </CardContent>

                  <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant={isCurrent ? 'outlined' : 'contained'}
                      color={isCurrent ? 'inherit' : 'primary'}
                      onClick={() => handleUpgrade({
                        id: planId || slug,
                        priceId,
                      })}
                      disabled={ctaDisabled}
                      startIcon={checkoutLoading[planId] ? <CircularProgress size={16} color="inherit" /> : null}
                      sx={{ textTransform: 'none' }}
                    >
                      {ctaLabel}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 900, mb: 1.5 }}>
            Frequently Asked Questions
          </Typography>
          <Stack spacing={1}>
            <Accordion variant="outlined" disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700 }}>What are credits?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">
                  Credits are used to process PDFs through our OCR system. Each PDF processing costs credits based on the number of pages.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion variant="outlined" disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700 }}>Can I cancel anytime?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">
                  Yes! You can cancel your subscription at any time. Your access will continue until the end of your billing period.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion variant="outlined" disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700 }}>Do unused credits roll over?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">
                  Credits reset every month. Unused credits from the previous month do not carry over.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion variant="outlined" disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700 }}>What payment methods do you accept?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">
                  We accept all major credit and debit cards through our secure Stripe payment processor.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
