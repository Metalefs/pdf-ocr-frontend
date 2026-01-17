import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import UploadZone from "./components/UploadZone";
import Progress from "./components/Progress";
import Result from "./components/Result";
import ErrorBox from "./components/ErrorBox";
import PlansPage from "./pages/PlansPage";
import AccountPage from "./pages/AccountPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ContactPage from "./pages/ContactPage";
import ApiKeysPage from "./pages/ApiKeysPage";
import AuthRequiredDialog from "./components/AuthRequiredDialog";
import DocsPage from "./pages/DocsPage";
import ApiDocsPage from "./pages/ApiDocsPage";
import PdfJsFontEncodingGuidePage from "./pages/guides/PdfJsFontEncodingGuidePage";
import BlogIndexPage from "./pages/blog/BlogIndexPage";
import BlogPostPage from "./pages/blog/BlogPostPage";
import OcrTextTestPage from "./pages/OcrTextTestPage";

import { processPdfAsync, processPdfDemo } from "./services/pdf.service";
import { getJobStatus, getJobDownloadUrl } from "./services/jobs.service";
import { withLanguageHeaders } from "./services/api";
import { I18nProvider, useI18n } from "./i18n";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
import { Routes, Route, Navigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import { alpha } from "@mui/material/styles";

import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import BoltIcon from "@mui/icons-material/Bolt";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import DescriptionIcon from "@mui/icons-material/Description";
import LockIcon from "@mui/icons-material/Lock";
import SpeedIcon from "@mui/icons-material/Speed";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import FontDownloadIcon from "@mui/icons-material/FontDownload";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import GavelIcon from "@mui/icons-material/Gavel";

function HomeContent({ currentPage, onNavigate, onRequireAuth }) {
    const { t, locale } = useI18n();
    const auth = useAuth();
    const { refreshUser } = auth;

    const DEMO_MAX_UPLOADS = 1;
    const DEMO_WINDOW_MS = 24 * 60 * 60 * 1000;
    const DEMO_STORAGE_KEY = 'pdf_ocr_demo_uploads_v1';

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [progressText, setProgressText] = useState("");
    const [progressPercent, setProgressPercent] = useState(null);
    const [logs, setLogs] = useState([]);
    const [resultUrl, setResultUrl] = useState(null);
    const [inputPreviewUrl, setInputPreviewUrl] = useState(null);
    const [error, setError] = useState(null);

    const readDemoCounter = () => {
        try {
            const now = Date.now();
            const raw = window.localStorage.getItem(DEMO_STORAGE_KEY);
            if (!raw) return { count: 0, resetAt: now + DEMO_WINDOW_MS };
            const parsed = JSON.parse(raw);
            const count = typeof parsed?.count === 'number' ? parsed.count : 0;
            const resetAt = typeof parsed?.resetAt === 'number' ? parsed.resetAt : (now + DEMO_WINDOW_MS);
            if (now >= resetAt) return { count: 0, resetAt: now + DEMO_WINDOW_MS };
            return { count: Math.max(0, Math.floor(count)), resetAt };
        } catch {
            return { count: 0, resetAt: Date.now() + DEMO_WINDOW_MS };
        }
    };

    const writeDemoCounter = (counter) => {
        try {
            window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(counter));
        } catch {
            // ignore
        }
    };

    const [demoCounter, setDemoCounter] = useState(() => {
        if (typeof window === 'undefined') return { count: 0, resetAt: 0 };
        return readDemoCounter();
    });

    const [forceAuthForNext, setForceAuthForNext] = useState(false);

    const [previewTab, setPreviewTab] = useState("before");

    // Create a local object URL for the selected file so we can preview it.
    useEffect(() => {
        if (!file) {
            setInputPreviewUrl(null);
            setPreviewTab("before");
            return;
        }

        const url = URL.createObjectURL(file);
        setInputPreviewUrl(url);

        return () => {
            if (typeof url === "string" && url.startsWith("blob:")) {
                URL.revokeObjectURL(url);
            }
        };
    }, [file]);

    // Revoke processed PDF object URLs when replaced/reset.
    useEffect(() => {
        return () => {
            if (typeof resultUrl === "string" && resultUrl.startsWith("blob:")) {
                URL.revokeObjectURL(resultUrl);
            }
        };
    }, [resultUrl]);

    function resetAll() {
        setFile(null);
        setResultUrl(null);
        setLogs([]);
        setError(null);
        setLoading(false);
        setProgressPercent(null);
    }

    const heroClaims = t("hero.claims");
    const whyBullets = t("why.bullets");
    const useCaseItems = t("useCases.items");

    const featureIcons = [
        DescriptionIcon,
        AutoFixHighIcon,
        LockIcon,
        SpeedIcon,
        CloudDoneIcon,
        BoltIcon,
    ];

    const featureAccents = ["primary", "secondary", "success", "info", "warning", "error"];

    const useCaseIcons = [
        FontDownloadIcon,
        FindInPageIcon,
        SwapHorizIcon,
        AccessibilityNewIcon,
        AccountTreeIcon,
        GavelIcon,
    ];

    const demoLimitReached = demoCounter.count >= DEMO_MAX_UPLOADS;
    const isAuthGated = !auth.user && (forceAuthForNext || demoLimitReached);
    // Disable only for missing file or while processing; auth-gated should remain clickable (to prompt sign-in).
    const isProcessDisabled = !file || loading;

    const processButtonLabel = loading
        ? (
            typeof progressPercent === "number" && Number.isFinite(progressPercent)
                ? `${t("process.syncing") || "Processing PDF..."} (${Math.round(progressPercent)}%)`
                : (t("process.syncing") || "Processing PDF...")
        )
        : (isAuthGated ? "Sign in to continue" : (t("process.button") || "Process PDF"));

    const processButtonHint = isAuthGated
        ? (t('authDialog.message') || 'Demo limit reached. Sign in to continue.')
        : (!file ? 'Select a PDF to enable processing.' : '');

    function handlePrimaryAction() {
        if (isAuthGated) {
            onRequireAuth?.(t('authDialog.message') || 'You have reached the demo limit. Create a free account to continue processing PDFs.');
            return;
        }

        void handleProcess();
    }

    async function handleProcess() {
            if (!file) return;

            setError(null);
            setResultUrl(null);
            setLogs([]);
            setLoading(true);

            try {
                setProgressText(t("process.uploading") || "Uploading file...");
                if (!auth.user) {
                    // unauthenticated: use demo endpoint
                    if (isAuthGated) {
                        onRequireAuth?.('You have used all free demo uploads. Please sign in to continue.');
                        setLoading(false);
                        return;
                    }

                    const job = await processPdfDemo(file);
                    pollJob(job.jobId);
                } else {
                    const job = await processPdfAsync(file);
                    pollJob(job.jobId);
                }
            } catch (err) {
                // If demo limit exceeded, require auth for next calls
                if (err && (err.status === 429 || err.code === 'DEMO_LIMIT')) {
                    setForceAuthForNext(true);
                    // Keep local counter in sync so the UI gates immediately
                    const next = { ...readDemoCounter(), count: DEMO_MAX_UPLOADS };
                    writeDemoCounter(next);
                    setDemoCounter(next);
                    const localized = t('authDialog.message');
                    const fallback = 'Demo limit reached. Please sign in or upgrade.';
                    onRequireAuth?.(
                        (localized && localized !== 'authDialog.message')
                            ? localized
                            : (err.details || fallback)
                    );
                } else if (err && (err.code === 'API_UNAVAILABLE' || (typeof err.status === 'number' && err.status >= 500))) {
                    setError({
                        code: 'API_UNAVAILABLE',
                        message: t('errors.apiUnavailable') || 'Service unavailable',
                        details: t('errors.apiUnavailableDetails') || 'The API appears to be offline or unreachable. Please try again in a moment.'
                    });
                } else {
                    setError(err && err.message ? { message: err.message, details: err.details, upgradeUrl: err.upgradeUrl } : err);
                }
                setLoading(false);
            }
    }

    function pollJob(jobId) {
            const interval = setInterval(async () => {
                try {
                    const status = await getJobStatus(jobId);

                    // Keep logs in sync (avoid duplicates caused by appending the last line repeatedly)
                    setLogs(Array.isArray(status.logs) ? status.logs : []);

                    const activePages = Array.isArray(status.activePages) ? status.activePages.filter((n) => typeof n === "number") : [];
                    const totalPages = typeof status.totalPages === "number" ? status.totalPages : null;
                    const processedPages = typeof status.processedPages === "number" ? status.processedPages : null;

                    function formatPages() {
                        if (!totalPages && !activePages.length && processedPages == null) return "";

                        if (activePages.length) {
                            const sorted = [...activePages].sort((a, b) => a - b);
                            const display = sorted.length <= 4 ? sorted.join(", ") : `${sorted.slice(0, 4).join(", ")}…`;
                            return totalPages ? ` (pages ${display} of ${totalPages})` : ` (pages ${display})`;
                        }

                        if (processedPages != null && totalPages) {
                            return ` (${processedPages}/${totalPages} pages)`;
                        }

                        return "";
                    }

                    const baseMessage =
                        (typeof status.message === "string" && status.message.trim())
                            ? status.message.trim()
                            : `${t("process.status")} ${status.status}`;

                    setProgressText(`${baseMessage}${formatPages()}`);

                    if (typeof status.progress === "number" && Number.isFinite(status.progress)) {
                        setProgressPercent(status.progress);
                    }

                    if (status.status === "completed") {
                        clearInterval(interval);
                        try {
                            const downloadUrl = getJobDownloadUrl(jobId);
                            const res = await fetch(downloadUrl, withLanguageHeaders());
                            if (!res.ok) {
                                if (res.status === 404) {
                                    const e = new Error(t("errors.jobNotFound") || "Job not found");
                                    e.status = 404;
                                    e.code = "JOB_NOT_FOUND";
                                    throw e;
                                }
                                throw new Error("Failed to download result");
                            }
                            const blob = await res.blob();
                            const blobUrl = URL.createObjectURL(blob);
                            setResultUrl(blobUrl);
                            // Refresh authenticated user data (credits/profile) after processing completes
                            try {
                                await refreshUser();
                            } catch (e) {
                                console.warn('Failed to refresh user after job completion', e);
                            }
                            // If the run was a demo (user not authenticated), increment the demo counter.
                            if (!auth.user) {
                                const current = readDemoCounter();
                                const updated = {
                                    ...current,
                                    count: current.count + 1,
                                };
                                writeDemoCounter(updated);
                                setDemoCounter(updated);
                                if (updated.count >= DEMO_MAX_UPLOADS) {
                                    setForceAuthForNext(true);
                                }
                            }
                        } catch (e) {
                            if (e && (e.code === "JOB_NOT_FOUND" || e.status === 404)) {
                                setError({ code: "JOB_NOT_FOUND", message: t("errors.jobNotFound") || "Job not found" });
                            } else {
                                setError(e && e.message ? { message: e.message, details: e.details, upgradeUrl: e.upgradeUrl } : (e.message || t("errors.generic")));
                            }
                        } finally {
                            setLoading(false);
                        }
                    }

                    if (status.status === "failed") {
                        clearInterval(interval);
                        throw new Error(status.error || t("errors.generic"));
                    }
                } catch (err) {
                    clearInterval(interval);
                    if (err && (err.code === "JOB_NOT_FOUND" || err.status === 404)) {
                        setError({ code: "JOB_NOT_FOUND", message: t("errors.jobNotFound") || "Job not found" });
                    } else {
                        setError(err && err.message ? { message: err.message, details: err.details, upgradeUrl: err.upgradeUrl } : err);
                    }
                    setLoading(false);
                }
            }, 1000);
    }

    if (currentPage === "auth-callback") {
        return <AuthCallbackPage onNavigate={onNavigate} />;
    }

    return (
        <Box component="main" sx={{ py: { xs: 0, md: 4 } }}>
            <Container maxWidth="lg" sx={{ px: 0 }}>
                {error && (
                    <ErrorBox
                        message={error?.message || error}
                        details={error?.details}
                        upgradeUrl={error?.upgradeUrl}
                        onRetry={(error?.code === "JOB_NOT_FOUND" || error?.code === "API_UNAVAILABLE") ? () => handleProcess() : null}
                        retryLabel={
                            error?.code === "JOB_NOT_FOUND"
                                ? (t("errors.processAgain") || "Process again")
                                : (t("errors.tryAgain") || "Try again")
                        }
                    />
                )}
                <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, border: 1, borderColor: "divider" }}>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h3" sx={{ fontWeight: 700, fontSize: { xs: "2rem", md: "2.75rem" } }}>
                            {t("hero.title")}
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ mt: 1, maxWidth: 900, fontWeight: 400 }}>
                            {t("hero.subtitle")}
                        </Typography>
                    </Box>

                    {file && (loading || resultUrl) ? (
                        <Box>
                            <Typography variant="overline" color="text.secondary">
                                Preview
                            </Typography>

                            <Tabs
                                value={previewTab}
                                onChange={(_, v) => setPreviewTab(v)}
                                sx={{ mt: 0.5, borderBottom: 1, borderColor: "divider" }}
                            >
                                <Tab value="before" label="Before" />
                                <Tab value="after" label={resultUrl ? "After" : "After (processing...)"} />
                            </Tabs>

                            <Box sx={{ mt: 2 }}>
                                {/* Keep the BEFORE iframe mounted to prevent flicker/reload while polling updates state */}
                                <Box hidden={previewTab !== "before"}>
                                    {inputPreviewUrl ? (
                                        <Box
                                            component="iframe"
                                            title="Before processing PDF preview"
                                            src={inputPreviewUrl}
                                            sx={{ width: "100%", height: { xs: 320, md: 400 }, border: 1, borderColor: "divider", borderRadius: 2 }}
                                        />
                                    ) : (
                                        <Box
                                            sx={{ height: { xs: 520, md: 640 }, display: "flex", alignItems: "center", justifyContent: "center", color: "text.secondary", border: 1, borderColor: "divider", borderRadius: 2 }}
                                        >
                                            No preview available
                                        </Box>
                                    )}
                                </Box>

                                <Box hidden={previewTab !== "after"}>
                                    {resultUrl ? (
                                        <Box
                                            component="iframe"
                                            title="After processing PDF preview"
                                            src={resultUrl}
                                            sx={{ width: "100%", height: { xs: 320, md: 400 }, border: 1, borderColor: "divider", borderRadius: 2 }}
                                        />
                                    ) : (
                                        <Box
                                            sx={{ height: { xs: 520, md: 540 }, display: "flex", alignItems: "center", justifyContent: "center", color: "text.secondary", border: 1, borderColor: "divider", borderRadius: 2 }}
                                        >
                                            Processing...
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    ) : (
                        <UploadZone file={file} onSelect={setFile} />
                    )}

                    {loading && <Progress text={progressText} percent={progressPercent} logs={logs} showLogs={false} />}
                    {resultUrl && <Result url={resultUrl} fileName={file?.name} onReset={resetAll} />}

                    <Tooltip
                        title={processButtonHint}
                        arrow
                        disableHoverListener={!processButtonHint}
                        disableFocusListener={!processButtonHint}
                        disableTouchListener={!processButtonHint}
                    >
                        <span>
                            <Button
                                onClick={handlePrimaryAction}
                                disabled={isProcessDisabled}
                                variant={isAuthGated ? "outlined" : "contained"}
                                size="large"
                                fullWidth
                                sx={{ mt: 2 }}
                                aria-busy={loading ? "true" : undefined}
                                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : undefined}
                            >
                                <span id="btnText">{processButtonLabel}</span>
                            </Button>
                        </span>
                    </Tooltip>

                    {processButtonHint ? (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                            {processButtonHint}
                        </Typography>
                    ) : null}

                    {Array.isArray(heroClaims) && heroClaims.length > 0 ? (
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="overline" color="text.secondary">
                                {t("header.nav.features")}
                            </Typography>
                            <Grid container spacing={2} sx={{ mt: 0.5 }}>
                                {heroClaims.map((claim, idx) => (
                                    <Grid item xs={12} sm={6} lg={4} key={`${idx}-${claim}`}>
                                        <Card
                                            tabIndex={0}
                                            role="listitem"
                                            aria-label={claim}
                                            sx={{
                                                height: "100%",
                                                borderRadius: 3,
                                            }}
                                        >
                                            <CardActionArea
                                                sx={(theme) => {
                                                    const accentKey = featureAccents[idx % featureAccents.length];
                                                    const accentMain = theme.palette[accentKey]?.main || theme.palette.primary.main;

                                                    return {
                                                        height: "100%",
                                                        borderRadius: 3,
                                                        border: `1px solid ${alpha(accentMain, 0.18)}`,
                                                        backgroundColor: alpha(accentMain, 0.06),
                                                        transition: theme.transitions.create([
                                                            "transform",
                                                            "background-color",
                                                            "box-shadow",
                                                        ], {
                                                            duration: theme.transitions.duration.short,
                                                        }),
                                                        '&:hover': {
                                                            backgroundColor: alpha(accentMain, 0.10),
                                                            boxShadow: theme.shadows[3],
                                                            transform: "translateY(-2px)",
                                                        },
                                                        '&:focus-visible': {
                                                            outline: `3px solid ${alpha(accentMain, 0.35)}`,
                                                            outlineOffset: 2,
                                                        },
                                                    };
                                                }}
                                            >
                                                <CardContent>
                                                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                                        {(() => {
                                                            const Icon = featureIcons[idx % featureIcons.length] || DescriptionIcon;
                                                            return (
                                                                <Avatar
                                                                    variant="rounded"
                                                                    sx={(theme) => {
                                                                        const accentKey = featureAccents[idx % featureAccents.length];
                                                                        const accentMain = theme.palette[accentKey]?.main || theme.palette.primary.main;
                                                                        return {
                                                                            bgcolor: alpha(accentMain, 0.14),
                                                                            color: accentMain,
                                                                            width: 44,
                                                                            height: 44,
                                                                            borderRadius: 2,
                                                                        };
                                                                    }}
                                                                >
                                                                    <Icon fontSize="small" />
                                                                </Avatar>
                                                            );
                                                        })()}

                                                        <Box sx={{ minWidth: 0 }}>
                                                            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
                                                                {claim}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                                {t("hero.uniqueClaim")}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                            {t("hero.uniqueClaim")}
                        </Typography>
                    )}

                    <Divider sx={{ my: { xs: 3, md: 4 } }} />

                    <Box component="section" aria-labelledby="why-title" sx={{ scrollMarginTop: 96 }}>
                        <Paper
                            variant="outlined"
                            sx={(theme) => ({
                                mt: 0,
                                borderRadius: 4,
                                overflow: "hidden",
                                borderColor: alpha(theme.palette.primary.main, 0.18),
                                background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.06)} 0%, ${alpha(theme.palette.background.paper, 0.75)} 70%)`,
                            })}
                        >
                            <Box sx={{ p: { xs: 2.5, md: 3 } }}>
                                <Grid container spacing={3} alignItems="flex-start">
                                    <Grid item xs={12} md={7}>
                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                            <Avatar
                                                variant="rounded"
                                                sx={(theme) => ({
                                                    bgcolor: alpha(theme.palette.primary.main, 0.14),
                                                    color: theme.palette.primary.main,
                                                    width: 46,
                                                    height: 46,
                                                    borderRadius: 2.5,
                                                })}
                                            >
                                                <LightbulbOutlinedIcon fontSize="small" />
                                            </Avatar>
                                            <Typography id="why-title" variant="h4" sx={{ fontWeight: 900, letterSpacing: -0.25, lineHeight: 1.15 }}>
                                                {t("why.title")}
                                            </Typography>
                                        </Stack>

                                        <Typography variant="body1" color="text.secondary" sx={{ mt: 1.25, maxWidth: 980 }}>
                                            {t("why.body1")}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary" sx={{ mt: 1.25, maxWidth: 980 }}>
                                            {t("why.body2")}
                                        </Typography>

                                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: 2.25 }}>
                                            <Button component={RouterLink} to="/docs" variant="contained">
                                                {String(locale).toLowerCase().startsWith("pt") ? "Ler Docs" : "Read Docs"}
                                            </Button>
                                            <Button component={RouterLink} to="/guides/pdfjs-font-encoding" variant="outlined">
                                                {String(locale).toLowerCase().startsWith("pt") ? "Ver guia pdf.js" : "View pdf.js guide"}
                                            </Button>
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={12} md={5}>
                                        <Card
                                            variant="outlined"
                                            sx={(theme) => ({
                                                height: "100%",
                                                borderRadius: 3,
                                                borderColor: alpha(theme.palette.primary.main, 0.18),
                                                bgcolor: alpha(theme.palette.background.paper, 0.75),
                                            })}
                                        >
                                            <CardContent>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 900, letterSpacing: -0.15 }}>
                                                    {String(locale).toLowerCase().startsWith("pt") ? "O que a plataforma resolve" : "What the platform solves"}
                                                </Typography>

                                                {Array.isArray(whyBullets) && whyBullets.length ? (
                                                    <Stack spacing={1.25} sx={{ mt: 1.5 }}>
                                                        {whyBullets.map((line, idx) => (
                                                            <Stack key={`${idx}-${line}`} direction="row" spacing={1.25} alignItems="flex-start">
                                                                <Box
                                                                    sx={(theme) => ({
                                                                        mt: "2px",
                                                                        color: theme.palette.primary.main,
                                                                        display: "flex",
                                                                    })}
                                                                >
                                                                    <CheckCircleOutlineIcon fontSize="small" />
                                                                </Box>
                                                                <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.35 }}>
                                                                    {line}
                                                                </Typography>
                                                            </Stack>
                                                        ))}
                                                    </Stack>
                                                ) : null}

                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1.75 }}>
                                                    {String(locale).toLowerCase().startsWith("pt")
                                                        ? "Foco em consistência de renderização e preservação de AcroForm — sem “achatar” o PDF."
                                                        : "Focused on rendering consistency and AcroForm preservation — without flattening the PDF."}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>
                    </Box>

                    <Box component="section" aria-labelledby="use-cases-title" sx={{ mt: { xs: 3, md: 4 }, scrollMarginTop: 96 }}>
                        <Paper
                            variant="outlined"
                            sx={(theme) => ({
                                borderRadius: 4,
                                overflow: "hidden",
                                borderColor: alpha(theme.palette.secondary.main, 0.16),
                                background: `linear-gradient(180deg, ${alpha(theme.palette.secondary.main, 0.05)} 0%, ${alpha(theme.palette.background.paper, 0.8)} 70%)`,
                            })}
                        >
                            <Box sx={{ p: { xs: 2.5, md: 3 } }}>
                                <Typography id="use-cases-title" variant="h4" sx={{ fontWeight: 900, letterSpacing: -0.25 }}>
                                    {t("useCases.title")}
                                </Typography>
                                <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 980 }}>
                                    {String(locale).toLowerCase().startsWith("pt")
                                        ? "Casos típicos onde corrigir fontes/Unicode e preservar formulários faz diferença no dia a dia."
                                        : "Common scenarios where fixing fonts/Unicode and preserving forms makes a real difference."}
                                </Typography>

                                {Array.isArray(useCaseItems) && useCaseItems.length ? (
                                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                                        {useCaseItems.map((item, idx) => (
                                            <Grid item xs={12} sm={6} key={`${idx}-${item?.title || "use-case"}`}>
                                                <Card
                                                    variant="outlined"
                                                    sx={(theme) => {
                                                        const accent = theme.palette[featureAccents[idx % featureAccents.length]]?.main || theme.palette.primary.main;
                                                        return {
                                                            height: "100%",
                                                            borderRadius: 3,
                                                            borderColor: alpha(accent, 0.22),
                                                            transition: theme.transitions.create([
                                                                "transform",
                                                                "box-shadow",
                                                                "border-color",
                                                                "background-color",
                                                            ], {
                                                                duration: theme.transitions.duration.short,
                                                            }),
                                                            '&:hover': {
                                                                transform: "translateY(-2px)",
                                                                boxShadow: theme.shadows[3],
                                                                borderColor: alpha(accent, 0.32),
                                                                backgroundColor: alpha(accent, 0.05),
                                                            },
                                                        };
                                                    }}
                                                >
                                                    <CardContent>
                                                        <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                                            {(() => {
                                                                const Icon = useCaseIcons[idx % useCaseIcons.length] || DescriptionIcon;
                                                                return (
                                                                    <Avatar
                                                                        variant="rounded"
                                                                        sx={(theme) => {
                                                                            const accentKey = featureAccents[idx % featureAccents.length];
                                                                            const accentMain = theme.palette[accentKey]?.main || theme.palette.primary.main;
                                                                            return {
                                                                                bgcolor: alpha(accentMain, 0.14),
                                                                                color: accentMain,
                                                                                width: 44,
                                                                                height: 44,
                                                                                borderRadius: 2.25,
                                                                            };
                                                                        }}
                                                                    >
                                                                        <Icon fontSize="small" />
                                                                    </Avatar>
                                                                );
                                                            })()}

                                                            <Box sx={{ minWidth: 0 }}>
                                                                <Typography variant="subtitle1" sx={{ fontWeight: 900, lineHeight: 1.25 }}>
                                                                    {item?.title}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                                                                    {item?.desc}
                                                                </Typography>
                                                            </Box>
                                                        </Stack>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                ) : null}
                            </Box>
                        </Paper>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}

function MainApp() {
    const [showAuthDialog, setShowAuthDialog] = useState(false);
    const [authDialogMessage, setAuthDialogMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(() => {
        const hash = window.location.hash;
        const params = new URLSearchParams(window.location.search);
        return (hash.includes('access_token') || params.get('code')) ? "auth-callback" : "home";
    });

    return (
        <I18nProvider defaultLocale="en">
            <AuthProvider>
            <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                <AuthRequiredDialog 
                    isOpen={showAuthDialog}
                    onClose={() => setShowAuthDialog(false)}
                    onSignIn={() => {
                        setShowAuthDialog(false);
                        // Trigger Google sign-in (button is in Header)
                        document.querySelector('[data-google-signin]')?.click();
                    }}
                    message={authDialogMessage}
                />

                <Header currentPage={currentPage} onNavigate={setCurrentPage} />

                <Box sx={{ flex: 1 }}>
                    <Routes>
                        <Route path="/auth/callback" element={<AuthCallbackPage />} />
                        <Route path="/plans" element={<PlansPage />} />
                        <Route path="/docs" element={<DocsPage />} />
                        <Route path="/api" element={<Navigate to="/docs/api" replace />} />
                        <Route path="/docs/api" element={<ApiDocsPage />} />
                        <Route path="/guides/pdfjs-font-encoding" element={<PdfJsFontEncodingGuidePage />} />
                        <Route path="/blog" element={<Navigate to="/pt/blog" replace />} />
                        <Route path="/blog/:slug" element={<BlogLegacyPostRedirect />} />
                        <Route path="/:lang/blog" element={<BlogIndexPage />} />
                        <Route path="/:lang/blog/:slug" element={<BlogPostPage />} />
                        <Route path="/account" element={<AccountPage />} />
                        <Route path="/api-keys" element={<ApiKeysPage />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route
                            path="/tools/ocr-text"
                            element={
                                <OcrTextTestPage
                                    onRequireAuth={(message) => {
                                        setAuthDialogMessage(message);
                                        setShowAuthDialog(true);
                                    }}
                                />
                            }
                        />
                        <Route
                            path="/"
                            element={
                                <HomeContent
                                    currentPage={currentPage}
                                    onNavigate={setCurrentPage}
                                    onRequireAuth={(message) => {
                                        setAuthDialogMessage(message);
                                        setShowAuthDialog(true);
                                    }}
                                />
                            }
                        />
                        <Route
                            path="/home"
                            element={
                                <HomeContent
                                    currentPage={currentPage}
                                    onNavigate={setCurrentPage}
                                    onRequireAuth={(message) => {
                                        setAuthDialogMessage(message);
                                        setShowAuthDialog(true);
                                    }}
                                />
                            }
                        />

                        {/* fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Box>

                <Footer />
            </Box>
            </AuthProvider>
        </I18nProvider>
    );
}

function BlogLegacyPostRedirect() {
    const { locale } = useI18n();
    const params = new URLSearchParams(window.location.search);
    const slug = window.location.pathname.split('/').pop();
    const lang = String(locale).toLowerCase().startsWith('pt') ? 'pt' : 'en';
    const qs = params.toString();
    const suffix = qs ? `?${qs}` : '';
    return <Navigate to={`/${lang}/blog/${slug}${suffix}`} replace />;
}

export default MainApp;