// src/pages/AccountPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BarChartIcon from "@mui/icons-material/BarChart";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import SecurityIcon from "@mui/icons-material/Security";

import { useI18n } from "../i18n";
import { useAuth } from "../contexts/AuthContext";
import { userService } from "../services/user.service";
import { paymentService } from "../services/payment.service";

export default function AccountPage({ onNavigate }) {
  const navigate = useNavigate();
  const { user, userProfile, credits, signOut, refreshUser, updateProfile } = useAuth();
  const { t } = useI18n();
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditAvatar(user.avatar || '');
      
      // Check if this is a successful payment callback
      const params = new URLSearchParams(window.location.search);
      if (params.get('payment') === 'success') {
        setPaymentSuccess(true);
        refreshUser();
        // Clear the URL parameter
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [user, refreshUser]);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        setError(null);
        const usageData = await userService.getUsage();
        setUsage(usageData);
      } catch (err) {
        console.error('Error fetching usage:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUsage();
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      setError('Name cannot be empty');
      return;
    }

    try {
      setUpdating(true);
      setError(null);
      await updateProfile(editName, editAvatar);
      setSuccess('Profile updated successfully!');
      setEditMode(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch {
      setError('Failed to sign out');
    }
  };

  const handleCancelSubscription = async () => {
    try {
      setCanceling(true);
      setError(null);
      setSuccess(null);

      // Default: cancel at period end (matches Plans page copy)
      await paymentService.cancelSubscription(false);

      await refreshUser();
      setSuccess('Subscription cancellation scheduled. Your access will remain active until the end of the billing period.');
      setCancelDialogOpen(false);
      setTimeout(() => setSuccess(null), 6000);
    } catch (err) {
      setError(err?.message || 'Failed to cancel subscription');
    } finally {
      setCanceling(false);
    }
  };

  const memberSinceLabel = useMemo(() => {
    const raw = user?.createdAt;
    if (!raw) return "—";
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString();
  }, [user?.createdAt]);

  if (!user) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: { xs: 3, md: 6 } }}>
        <Container maxWidth="sm">
          <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 } }}>
            <Stack spacing={1.5}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Please log in to view your account
              </Typography>
              <Typography color="text.secondary">
                Sign in with your Google or GitHub account to access your account settings and usage statistics.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                If you just upgraded, sign in again to refresh your plan.
              </Typography>
            </Stack>
          </Paper>
        </Container>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography color="text.secondary">Loading account information…</Typography>
        </Stack>
      </Box>
    );
  }

  const limit = typeof usage?.limit === "number" && usage.limit > 0 ? usage.limit : null;
  const today = typeof usage?.today === "number" && usage.today >= 0 ? usage.today : null;
  const usagePercent = limit && today != null ? Math.min((today / limit) * 100, 100) : 0;
  const planLabel = (user?.plan ? (user.plan.charAt(0).toUpperCase() + user.plan.slice(1)) : "Free");

  const StatCard = ({ title, value, caption }) => (
    <Paper variant="outlined" sx={{ p: 2.25, height: "100%" }}>
      <Stack spacing={0.5}>
        <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 0.8 }}>
          {title}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
          {value}
        </Typography>
        {caption ? (
          <Typography variant="body2" color="text.secondary">
            {caption}
          </Typography>
        ) : null}
      </Stack>
    </Paper>
  );

  const SectionTitle = ({ icon, title, action }) => (
    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            bgcolor: "action.hover",
            color: "text.primary",
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800 }} noWrap>
          {title}
        </Typography>
      </Stack>
      {action || null}
    </Stack>
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <Stack spacing={2.5}>
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 2.5, md: 3 },
              background:
                "linear-gradient(135deg, rgba(25,118,210,0.08) 0%, rgba(124,77,255,0.08) 45%, rgba(0,0,0,0) 100%)",
            }}
          >
            <Stack spacing={1.25}>
              <Typography variant="h4" sx={{ fontWeight: 900 }}>
                Account
              </Typography>
              <Typography color="text.secondary">
                Manage your profile, plan, and usage.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "stretch", sm: "center" }}>
                <Chip label={`Plan: ${planLabel}`} color="primary" variant="outlined" />
                <Chip label={`Credits: ${credits?.credits || 0}`} variant="outlined" />
                {limit ? (
                  <Chip label={`Today: ${today != null ? today : 0} / ${limit}`} variant="outlined" />
                ) : null}
              </Stack>
            </Stack>
          </Paper>

          {paymentSuccess && (
            <Alert severity="success" variant="outlined">
              Your plan has been upgraded successfully! Thank you for your purchase.
            </Alert>
          )}

          {error && (
            <Alert severity="error" variant="outlined" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" variant="outlined" onClose={() => setSuccess(null)}>
              {success}
            </Alert>
          )}

          <Grid container spacing={2.5}>
            {/* Summary stats */}
            <Grid item xs={12} md={4}>
              <StatCard title="Plan" value={planLabel} caption={user?.subscriptionEndsAt ? `Renews ${new Date(user.subscriptionEndsAt).toLocaleDateString()}` : ""} />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard title="Credits" value={credits?.credits || 0} caption="Monthly allocation" />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard title="Today" value={limit ? `${today != null ? today : 0} / ${limit}` : (today != null ? today : 0)} caption={limit ? `${Math.round(usagePercent)}% used` : ""} />
            </Grid>

            {/* Profile */}
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack spacing={2}>
                  <SectionTitle
                    icon={<AccountCircleIcon fontSize="small" />}
                    title="Profile"
                    action={
                      !editMode ? (
                        <Button variant="outlined" onClick={() => setEditMode(true)}>
                          Edit
                        </Button>
                      ) : null
                    }
                  />

                  <Divider />

                  {!editMode ? (
                    <Stack spacing={2}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          src={user.avatar || undefined}
                          alt={user.name || user.email}
                          sx={{ width: 72, height: 72 }}
                        />
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }} noWrap>
                            {user.name || "Not set"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {user.email}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Member since {memberSinceLabel}
                          </Typography>
                        </Box>
                      </Stack>

                      {userProfile?.username && (
                        <Typography variant="body2" color="text.secondary">
                          Username: {userProfile.username}
                        </Typography>
                      )}
                    </Stack>
                  ) : (
                    <Box component="form" onSubmit={handleUpdateProfile}>
                      <Stack spacing={2}>
                        <TextField
                          label="Name"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          autoComplete="name"
                          required
                          fullWidth
                        />

                        <TextField
                          label="Avatar URL"
                          value={editAvatar}
                          onChange={(e) => setEditAvatar(e.target.value)}
                          type="url"
                          autoComplete="url"
                          fullWidth
                        />

                        {editAvatar ? (
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar src={editAvatar} alt="Avatar preview" />
                            <Typography variant="body2" color="text.secondary">
                              Preview
                            </Typography>
                          </Stack>
                        ) : null}

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="flex-end">
                          <Button
                            type="button"
                            variant="text"
                            onClick={() => {
                              setEditMode(false);
                              setEditName(user.name || "");
                              setEditAvatar(user.avatar || "");
                            }}
                            disabled={updating}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" variant="contained" disabled={updating}>
                            {updating ? "Saving…" : "Save"}
                          </Button>
                        </Stack>
                      </Stack>
                    </Box>
                  )}
                </Stack>
              </Paper>
            </Grid>

            {/* Plan */}
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack spacing={2}>
                  <SectionTitle
                    icon={<CreditCardIcon fontSize="small" />}
                    title="Current plan"
                    action={<Chip label={planLabel} color="primary" variant="outlined" />}
                  />

                  <Divider />

                  <Stack spacing={1.25}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                      <Typography color="text.secondary">Monthly credits</Typography>
                      <Typography sx={{ fontWeight: 700 }}>{credits?.credits || 0}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                      <Typography color="text.secondary">Plan type</Typography>
                      <Typography sx={{ fontWeight: 700 }}>{user.plan}</Typography>
                    </Box>
                    {user?.subscriptionEndsAt ? (
                      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                        <Typography color="text.secondary">Renews on</Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {new Date(user.subscriptionEndsAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    ) : null}
                  </Stack>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                    <Button
                      variant="contained"
                      onClick={() => {
                        if (onNavigate) onNavigate("plans");
                        else navigate("/plans");
                      }}
                      fullWidth
                    >
                      Upgrade / change plan
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => navigate("/api-keys")}
                      fullWidth
                    >
                      {t("header.nav.apiKeys") || t("apiKeys.title")}
                    </Button>
                  </Stack>

                  {user?.plan && user.plan !== 'free' ? (
                    <Button
                      color="error"
                      variant="text"
                      onClick={() => setCancelDialogOpen(true)}
                      disabled={canceling}
                      sx={{ alignSelf: 'flex-start' }}
                    >
                      Cancel subscription
                    </Button>
                  ) : null}
                </Stack>
              </Paper>
            </Grid>

            <Dialog
              open={cancelDialogOpen}
              onClose={() => (canceling ? null : setCancelDialogOpen(false))}
              aria-labelledby="cancel-subscription-title"
              aria-describedby="cancel-subscription-description"
            >
              <DialogTitle id="cancel-subscription-title">Cancel subscription</DialogTitle>
              <DialogContent>
                <DialogContentText id="cancel-subscription-description">
                  This will cancel your subscription at the end of your current billing period. You will keep access until then.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setCancelDialogOpen(false)} disabled={canceling}>
                  Keep subscription
                </Button>
                <Button
                  onClick={handleCancelSubscription}
                  color="error"
                  variant="contained"
                  disabled={canceling}
                >
                  {canceling ? 'Canceling…' : 'Confirm cancel'}
                </Button>
              </DialogActions>
            </Dialog>

            {/* Usage */}
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack spacing={2}>
                  <SectionTitle icon={<BarChartIcon fontSize="small" />} title="Credit usage" />
                  <Divider />

                  {usage ? (
                    <Stack spacing={2}>
                      <Box>
                        <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                          <Typography color="text.secondary">Today</Typography>
                          <Typography sx={{ fontWeight: 700 }}>
                            {today != null ? today : 0}
                            {limit ? ` / ${limit}` : ""}
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant={limit ? "determinate" : "indeterminate"}
                          value={usagePercent}
                          sx={{ mt: 1, height: 10, borderRadius: 99 }}
                        />
                      </Box>

                      <Stack direction="row" spacing={2} justifyContent="space-between">
                        <Box>
                          <Typography color="text.secondary" variant="body2">
                            This week
                          </Typography>
                          <Typography sx={{ fontWeight: 800 }}>
                            {typeof usage.week === "number" ? usage.week : 0}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: "right" }}>
                          <Typography color="text.secondary" variant="body2">
                            This month
                          </Typography>
                          <Typography sx={{ fontWeight: 800 }}>
                            {typeof usage.month === "number" ? usage.month : 0}
                          </Typography>
                        </Box>
                      </Stack>
                    </Stack>
                  ) : (
                    <Typography color="text.secondary">No usage data available.</Typography>
                  )}
                </Stack>
              </Paper>
            </Grid>

            {/* Security */}
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack spacing={2}>
                  <SectionTitle icon={<SecurityIcon fontSize="small" />} title="Security" />
                  <Divider />
                  <Typography color="text.secondary">
                    Your password is managed by your authentication provider (Google/GitHub).
                    To change security settings, visit your provider’s account settings.
                  </Typography>
                  <Button color="error" variant="outlined" onClick={handleSignOut} sx={{ alignSelf: "flex-start" }}>
                    Sign out
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
