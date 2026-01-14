import React from 'react';
import { useI18n } from "../i18n";
import { Link as RouterLink } from 'react-router-dom';

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

/**
 * Footer simples para o aplicativo TextLayer OCR Frontend.
 * Mantém-se intencionalmente minimalista para facilitar adaptação ao estilo do projeto.
 */
const Footer = () => {
  const year = new Date().getFullYear();
  const { t } = useI18n();

  return (
        <Box component="footer" sx={{ py: 6, bgcolor: "background.default" }}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={5}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {t("header.brand")}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {t("hero.subtitle")}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            {t("footer.technology")}
                        </Typography>
                        <Stack spacing={0.5}>
                            <Typography variant="body2" color="text.secondary">Tesseract</Typography>
                            <Typography variant="body2" color="text.secondary">iText PDF</Typography>
                            <Typography variant="body2" color="text.secondary">SkiaSharp</Typography>
                            <Typography variant="body2" color="text.secondary">PDFium</Typography>
                            <Typography variant="body2" color="text.secondary">Scalable Processing</Typography>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            {t("footer.privacy")}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {t("footer.privacy") === "Privacidade"
                                ? "Arquivos processados de forma segura e removidos conforme política de retenção."
                                : "Files are processed securely and removed according to retention policy."}
                        </Typography>
                        <Stack direction="row" spacing={2} sx={{ mt: 1.5 }}>
                            <Link component={RouterLink} to="/privacy" underline="hover">
                                {t("footer.privacy")}
                            </Link>
                            <Link component={RouterLink} to="/docs" underline="hover">
                                {t("header.nav.docs") || "Docs"}
                            </Link>
                            <Link component={RouterLink} to="/docs/api" underline="hover">
                                API
                            </Link>
                            <Link component={RouterLink} to="/guides/pdfjs-font-encoding" underline="hover">
                                {t("footer.privacy") === "Privacidade" ? "Guia pdf.js" : "pdf.js guide"}
                            </Link>
                            <Link component={RouterLink} to="/contact" underline="hover">
                                Contact
                            </Link>
                        </Stack>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Typography variant="body2" color="text.secondary" align="center">
                    © {year} {t("header.brand")}. {t("footer.copy")}
                </Typography>
            </Container>
        </Box>
  );
};


export default Footer;