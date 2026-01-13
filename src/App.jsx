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

import { processPdfAsync, processPdfDemo } from "./services/pdf.service";
import { getJobStatus, getJobDownloadUrl } from "./services/jobs.service";
import { I18nProvider, useI18n } from "./i18n";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
import { Routes, Route, Navigate } from 'react-router-dom';

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";

import { alpha } from "@mui/material/styles";

import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import BoltIcon from "@mui/icons-material/Bolt";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import DescriptionIcon from "@mui/icons-material/Description";
import LockIcon from "@mui/icons-material/Lock";
import SpeedIcon from "@mui/icons-material/Speed";

function HomeContent({ currentPage, onNavigate, onRequireAuth }) {
    const { t } = useI18n();
    const auth = useAuth();
    const { refreshUser } = auth;

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [progressText, setProgressText] = useState("");
    const [progressPercent, setProgressPercent] = useState(null);
    const [logs, setLogs] = useState([]);
    const [resultUrl, setResultUrl] = useState(null);
    const [inputPreviewUrl, setInputPreviewUrl] = useState(null);
    const [error, setError] = useState(null);
    const [requireAuthForNext, setRequireAuthForNext] = useState(false);

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

    const featureIcons = [
        DescriptionIcon,
        AutoFixHighIcon,
        LockIcon,
        SpeedIcon,
        CloudDoneIcon,
        BoltIcon,
    ];

    const featureAccents = ["primary", "secondary", "success", "info", "warning", "error"];

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
                    if (requireAuthForNext) {
                        onRequireAuth?.('You have used your free demo. Please sign in to continue.');
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
                // If demo limit exceeded (429), require auth for next calls
                if (err && err.status === 429) {
                    setRequireAuthForNext(true);
                    onRequireAuth?.(err.details || 'Demo limit reached. Please sign in or upgrade.');
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
                            const res = await fetch(downloadUrl);
                            if (!res.ok) throw new Error("Failed to download result");
                            const blob = await res.blob();
                            const blobUrl = URL.createObjectURL(blob);
                            setResultUrl(blobUrl);
                            // Refresh authenticated user data (credits/profile) after processing completes
                            try {
                                await refreshUser();
                            } catch (e) {
                                console.warn('Failed to refresh user after job completion', e);
                            }
                            // If the run was a demo (user not authenticated), require auth for next calls
                            if (!auth.user) setRequireAuthForNext(true);
                        } catch (e) {
                            setError(e && e.message ? { message: e.message, details: e.details, upgradeUrl: e.upgradeUrl } : (e.message || t("errors.generic")));
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
                    setError(err && err.message ? { message: err.message, details: err.details, upgradeUrl: err.upgradeUrl } : err);
                    setLoading(false);
                }
            }, 1000);
    }

    if (currentPage === "auth-callback") {
        return <AuthCallbackPage onNavigate={onNavigate} />;
    }

    return (
        <Box component="main" sx={{ py: { xs: 3, md: 4 } }}>
            <Container maxWidth="lg">
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

                    <Button
                        onClick={handleProcess}
                        disabled={!file || loading}
                        variant="contained"
                        size="large"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        <span id="btnText">{t("process.button")}</span>
                    </Button>

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

                    {error && <ErrorBox message={error?.message || error} details={error?.details} upgradeUrl={error?.upgradeUrl} />}
                </Paper>
            </Container>
        </Box>
    );
}

function MainApp() {
    const [showAuthDialog, setShowAuthDialog] = useState(false);
    const [authDialogMessage, setAuthDialogMessage] = useState('');
    const [currentPage, setCurrentPage] = useState("home");

    // Detectar rota de callback no carregamento
    useEffect(() => {
        const hash = window.location.hash;
        const params = new URLSearchParams(window.location.search);

        // Verifica se é callback do OAuth
        if (hash.includes('access_token') || params.get('code')) {
            setCurrentPage("auth-callback");
        }
    }, []);

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
                        <Route path="/account" element={<AccountPage />} />
                        <Route path="/api-keys" element={<ApiKeysPage />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                        <Route path="/contact" element={<ContactPage />} />
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

export default MainApp;