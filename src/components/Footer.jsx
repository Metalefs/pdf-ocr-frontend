import React from "react";
import { Link as RouterLink } from "react-router-dom";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useI18n } from "../i18n";

/**
 * Footer simples para o aplicativo TextLayer OCR Frontend.
 * Mantém-se intencionalmente minimalista para facilitar adaptação ao estilo do projeto.
 */
const Footer = () => {
  const year = new Date().getFullYear();
    const { t, locale } = useI18n();
    const isPt = String(locale).toLowerCase().startsWith("pt");

    const linkSx = {
        color: "text.secondary",
        fontWeight: 600,
        textDecorationColor: "divider",
        "&:hover": { color: "text.primary" },
    };

  return (
        <Box
            component="footer"
            sx={{
                mt: 6,
                bgcolor: "background.default",
                borderTop: 1,
                borderColor: "divider",
            }}
        >
            <Box
                sx={{
                    height: 3,
                    background: "linear-gradient(90deg, rgba(99,102,241,0.65) 0%, rgba(14,165,233,0.55) 45%, rgba(16,185,129,0.45) 100%)",
                }}
            />

            <Container maxWidth="lg" sx={{ py: { xs: 5, md: 6 } }}>
                <Box
                    sx={{
                        display: { xs: "block", md: "grid" },
                        gridTemplateColumns: { md: "minmax(0, 1.2fr) repeat(3, minmax(0, 1fr))" },
                        gap: 3,
                    }}
                >
                    <Stack spacing={1.25}>
                        <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: -0.2 }}>
                            {t("header.brand")}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 520 }}>
                            {t("header.subtitle") || t("hero.subtitle")}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", pt: 0.5 }}>
                            {["Tesseract", "PDFium", "iText", "SkiaSharp"].map((label) => (
                                <Chip key={label} size="small" label={label} variant="outlined" />
                            ))}
                        </Stack>
                    </Stack>

                    <Stack spacing={1}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
                            {isPt ? "Produto" : "Product"}
                        </Typography>
                        <Stack spacing={0.75}>
                            <Link component={RouterLink} to="/" underline="hover" sx={linkSx}>
                                {isPt ? "Upload" : "Upload"}
                            </Link>
                            <Link component={RouterLink} to="/plans" underline="hover" sx={linkSx}>
                                {isPt ? "Planos" : "Pricing"}
                            </Link>
                            <Link component={RouterLink} to="/api-keys" underline="hover" sx={linkSx}>
                                {t("header.nav.apiKeys") || (isPt ? "Chaves de API" : "API Keys")}
                            </Link>
                            <Link component={RouterLink} to="/account" underline="hover" sx={linkSx}>
                                {isPt ? "Conta" : "Account"}
                            </Link>
                        </Stack>
                    </Stack>

                    <Stack spacing={1}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
                            {isPt ? "Recursos" : "Resources"}
                        </Typography>
                        <Stack spacing={0.75}>
                            <Link component={RouterLink} to={isPt ? "/pt/blog" : "/en/blog"} underline="hover" sx={linkSx}>
                                Blog
                            </Link>
                            <Link component={RouterLink} to="/docs" underline="hover" sx={linkSx}>
                                {t("header.nav.docs") || "Docs"}
                            </Link>
                            <Link component={RouterLink} to="/docs/api" underline="hover" sx={linkSx}>
                                {isPt ? "Referência da API" : "API Reference"}
                            </Link>
                            <Link component={RouterLink} to="/guides/pdfjs-font-encoding" underline="hover" sx={linkSx}>
                                {isPt ? "Guia (pdf.js)" : "Guide (pdf.js)"}
                            </Link>
                            <Link component={RouterLink} to="/contact" underline="hover" sx={linkSx}>
                                {isPt ? "Contato" : "Contact"}
                            </Link>
                        </Stack>
                    </Stack>

                    <Stack spacing={1}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
                            {t("footer.privacy")}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
                            {isPt
                                ? "🔒 Zero armazenamento. Tudo é processado em memória e descartado imediatamente."
                                : "🔒 Zero storage. Everything is processed in-memory and discarded immediately."}
                        </Typography>
                        <Stack spacing={0.75} sx={{ pt: 0.25 }}>
                            <Link component={RouterLink} to="/privacy" underline="hover" sx={linkSx}>
                                {isPt ? "Política de privacidade" : "Privacy policy"}
                            </Link>
                        </Stack>
                    </Stack>
                </Box>

                <Divider sx={{ my: 4 }} />

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 1.5,
                        alignItems: { xs: "flex-start", sm: "center" },
                        justifyContent: "space-between",
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        © {year} {t("header.brand")}. {t("footer.copy")}
                    </Typography>

                    <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
                        <Link component={RouterLink} to="/docs" underline="hover" sx={linkSx}>
                            Docs
                        </Link>
                        <Link component={RouterLink} to="/contact" underline="hover" sx={linkSx}>
                            {isPt ? "Suporte" : "Support"}
                        </Link>
                    </Stack>
                </Box>
            </Container>
        </Box>
  );
};


export default Footer;