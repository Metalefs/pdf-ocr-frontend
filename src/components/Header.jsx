import React, { useMemo, useState } from "react";
import { useI18n } from "../i18n";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from 'react-router-dom';
import brandLogo from "../assets/brand-logo.svg";

import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import KeyIcon from "@mui/icons-material/VpnKey";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function Header({ onNavigate }) {
  const { t, locale, setLocale } = useI18n();
  const { user, credits, loading, signInWithGoogle, signInWithGithub, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  const userMenuOpen = Boolean(userMenuAnchor);

  const subtitleParts = String(t("header.subtitle") || "")
    .split("•")
    .map((s) => s.trim())
    .filter(Boolean);

  const navItems = useMemo(() => {
    const items = [
      {
        key: "home",
        label: "Home",
        path: "/",
        active: currentPath === "/" || currentPath === "/home",
      },
      {
        key: "docs",
        label: (t('header.nav.docs') || 'Docs'),
        path: "/docs",
        active: currentPath.startsWith("/docs"),
      },
      {
        key: "text-test",
        label: (t('header.nav.textTest') || (String(locale).toLowerCase().startsWith('pt') ? 'Teste (Texto)' : 'Text Test')),
        path: "/tools/ocr-text",
        active: currentPath === "/tools/ocr-text",
      },
      // {
      //   key: "api",
      //   label: "API",
      //   path: "/docs/api",
      //   active: currentPath === "/docs/api" || currentPath === "/api",
      // },
      {
        key: "blog",
        label: t('header.nav.blog') ?? 'Blog',
        path: String(locale).toLowerCase().startsWith('pt') ? '/pt/blog' : '/en/blog',
        active: currentPath.startsWith('/pt/blog') || currentPath.startsWith('/en/blog'),
      },
      {
        key: "guide",
        label: String(locale).toLowerCase().startsWith('pt') ? 'Guia' : 'Guide',
        path: "/guides/pdfjs-font-encoding",
        active: currentPath === "/guides/pdfjs-font-encoding",
      },
      {
        key: "plans",
        label: (t('header.nav.features') === 'Features' ? 'Plans' : t('plans.header')),
        path: "/plans",
        active: currentPath === "/plans",
      },
    ];

    // if (user) {
    //   items.push({
    //     key: "account",
    //     label: "Account",
    //     path: "/account",
    //     active: currentPath === "/account",
    //   });
    //   items.push({
    //     key: "api-keys",
    //     label: (t('header.nav.apiKeys') || t('apiKeys.title')),
    //     path: "/api-keys",
    //     active: currentPath === "/api-keys",
    //   });
    // }

    return items;
  }, [currentPath, locale, t]);

  const handleSignOut = async () => {
    try {
      await signOut();
      setUserMenuAnchor(null);
      if (onNavigate) onNavigate("home");
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Toolbar sx={{ gap: 2 }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="Open navigation"
          onClick={() => setMobileOpen(true)}
          sx={{ display: { xs: "inline-flex", md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <Box
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (onNavigate) onNavigate("home");
            navigate("/");
            setMobileOpen(false);
          }}
          sx={{ display: { xs: "none", lg: "flex" }, alignItems: "center", gap: 1.5, cursor: "pointer", minWidth: 0 }}
        >
          <Box component="img" src={brandLogo} alt={t("header.brand")} sx={{ width: 32, height: 32 }} />
          <Typography variant="h6" noWrap sx={{ fontWeight: 500 }}>
            {t("header.brand")}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            noWrap
            sx={{ display: { xs: "none", lg: "block" }, maxWidth: 520 }}
          >
            {subtitleParts.slice(0, 3).join(" • ")}
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Desktop navigation */}
        <Stack direction="row" spacing={1} sx={{ display: { xs: "none", md: "flex" } }}>
          {navItems.map((item) => (
            <Button
              key={item.key}
              color={item.active ? "primary" : "inherit"}
              variant={item.active ? "contained" : "text"}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                if (onNavigate) onNavigate(item.key);
                navigate(item.path);
                setMobileOpen(false);
              }}
              aria-current={item.active ? "page" : undefined}
              sx={{ textTransform: "none" }}
            >
              {item.label}
            </Button>
          ))}
        </Stack>

        {/* Auth / User */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          {loading ? (
            <Typography variant="body2" color="text.secondary">Loading...</Typography>
          ) : user ? (
            <>
              {typeof credits?.credits === "number" && (
                <Chip
                  size="small"
                  color="primary"
                  variant="outlined"
                  label={`${credits.credits} credits`}
                  sx={{ display: { xs: "none", md: "inline-flex" } }}
                />
              )}

              <Button
                onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                color="inherit"
                sx={{ textTransform: "none", gap: 1, px: 1.25 }}
                aria-controls={userMenuOpen ? "user-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={userMenuOpen ? "true" : undefined}
              >
                <Avatar
                  src={user.avatar || undefined}
                  alt={user.name}
                  sx={{ width: 32, height: 32 }}
                >
                  {user.name?.at(0)?.toUpperCase()}
                </Avatar>
                <Box sx={{ display: { xs: "none", md: "block" }, textAlign: "left" }}>
                  <Typography variant="body2" sx={{ lineHeight: 1.1 }}>
                    {user.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.1, textTransform: "capitalize" }}>
                    {user.plan}
                  </Typography>
                </Box>
              </Button>

              <Menu
                id="user-menu"
                anchorEl={userMenuAnchor}
                open={userMenuOpen}
                onClose={() => setUserMenuAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <Box sx={{ px: 2, py: 1.25 }}>
                  <Typography variant="subtitle2">{user.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                </Box>
                <Divider />
                <MenuItem
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setUserMenuAnchor(null);
                    navigate("/account");
                    if (onNavigate) onNavigate("account");
                  }}
                >
                  <PersonIcon fontSize="small" style={{ marginRight: 8 }} />
                  My Account
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setUserMenuAnchor(null);
                    navigate("/api-keys");
                    if (onNavigate) onNavigate("api-keys");
                  }}
                >
                  <KeyIcon fontSize="small" style={{ marginRight: 8 }} />
                  {t('header.nav.apiKeys') || t('apiKeys.title')}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setUserMenuAnchor(null);
                    navigate("/plans");
                    if (onNavigate) onNavigate("plans");
                  }}
                >
                  <WorkspacePremiumIcon fontSize="small" style={{ marginRight: 8 }} />
                  Upgrade Plan
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleSignOut}>
                  <LogoutIcon fontSize="small" style={{ marginRight: 8 }} />
                  Sign Out
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                data-google-signin
                variant="outlined"
                onClick={signInWithGoogle}
                startIcon={<GoogleIcon />}
                sx={{
                  textTransform: "none",
                  bgcolor: "common.white",
                  color: "#3c4043",
                  borderColor: "#dadce0",
                  '&:hover': {
                    bgcolor: "#f8f9fa",
                    borderColor: "#dadce0",
                  },
                }}
              >
                Google
              </Button>
              <Button
                variant="contained"
                onClick={signInWithGithub}
                startIcon={<GitHubIcon />}
                sx={{
                  textTransform: "none",
                  bgcolor: "#24292e",
                  '&:hover': {
                    bgcolor: "#1f2328",
                  },
                }}
              >
                GitHub
              </Button>
            </>
          )}

          <Select
            size="small"
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            sx={{ minWidth: 72, '& .MuiSelect-select': { py: 0.75 } }}
            variant="outlined"
            aria-label="Language"
          >
            <MenuItem value="en">EN</MenuItem>
            <MenuItem value="pt">PT</MenuItem>
          </Select>
        </Stack>
      </Toolbar>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      >
        <Box sx={{ width: 280 }} role="presentation">
          <Box sx={{ px: 2, py: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {t("header.brand")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {subtitleParts.slice(0, 2).join(" • ")}
            </Typography>
          </Box>
          <Divider />
          <List>
            {navItems.map((item) => (
              <ListItem key={item.key} disablePadding>
                <ListItemButton
                  selected={item.active}
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    if (onNavigate) onNavigate(item.key);
                    navigate(item.path);
                    setMobileOpen(false);
                  }}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider />
          <Box sx={{ px: 2, py: 2 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Language
            </Typography>
            <Select
              size="small"
              fullWidth
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              aria-label="Language"
            >
              <MenuItem value="en">EN</MenuItem>
              <MenuItem value="pt">PT</MenuItem>
            </Select>
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
}