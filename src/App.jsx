import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import UploadZone from "./components/UploadZone";
import Progress from "./components/Progress";
import Result from "./components/Result";
import ErrorBox from "./components/ErrorBox";
import SidebarPreview from "./components/SidebarPreview";
import PlansPage from "./pages/PlansPage";
import AccountPage from "./pages/AccountPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ContactPage from "./pages/ContactPage";
import ApiKeysPage from "./pages/ApiKeysPage";

import { processPdfAsync } from "./services/pdf.service";
import { getJobStatus, getJobDownloadUrl } from "./services/jobs.service";
import { I18nProvider, useI18n } from "./i18n";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
import { Routes, Route, Navigate } from 'react-router-dom';

function MainApp() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [progressText, setProgressText] = useState("");
    const [logs, setLogs] = useState([]);
    const [resultUrl, setResultUrl] = useState(null);
    const [error, setError] = useState(null);
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

    function resetAll() {
        setFile(null);
        setResultUrl(null);
        setLogs([]);
        setError(null);
        setLoading(false);
    }

    function MainContent() {
    const { t } = useI18n();
    const { refreshUser } = useAuth();
    const heroClaims = t("hero.claims");

        async function handleProcess() {
            if (!file) return;

            setError(null);
            setResultUrl(null);
            setLogs([]);
            setLoading(true);

            try {
                setProgressText(t("process.uploading") || "Uploading file...");
                const job = await processPdfAsync(file);
                pollJob(job.jobId);
            } catch (err) {
                setError(err && err.message ? { message: err.message, details: err.details, upgradeUrl: err.upgradeUrl } : err);
                setLoading(false);
            }
        }

        function pollJob(jobId) {
            const interval = setInterval(async () => {
                try {
                    const status = await getJobStatus(jobId);

                    if (status.logs?.length) {
                        setLogs((prev) => [...prev, status.logs.at(-1)]);
                    }

                    setProgressText(`${t("process.status")} ${status.status}`);

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

        // Renderizar página apropriada
        if (currentPage === "auth-callback") {
            return <AuthCallbackPage onNavigate={setCurrentPage} />;
        }

        return (
            <>
                
                {currentPage === "home" && (
                    <main className="max-w-7xl mx-auto  px-4 pb-10">
                        <section className="max-w-6xl mx-auto py-8 pb-2">
                            <div className="text-center mb-10">
                                <h2 className="text-4xl md:text-5xl font-extrabold mb-8">
                                    {t("hero.title")}
                                </h2>
                                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                    {t("hero.subtitle")}
                                </p>
                                {Array.isArray(heroClaims) ? (
                                    <ul className="mt-6 grid gap-4 sm:grid-cols-1 md:grid-cols-3">
                                        {heroClaims.map((c, i) => (
                                            <li key={i} className="flex items-start gap-3 bg-white border border-slate-100 p-4 rounded-lg shadow-sm">
                                                <div className="flex-shrink-0 mt-0.5 text-blue-500 text-xl">✓</div>
                                                <div className="text-sm text-slate-700">{c}</div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="mt-4 text-lg font-bold">{t("hero.uniqueClaim")}</p>
                                )}
                            </div>
                        </section>

                        <div className="grid gap-8 lg:grid-cols-3">
                            <div className={resultUrl ? "lg:col-span-2 bg-white rounded-2xl shadow-2xl p-4 md:p-8" : "lg:col-span-3 bg-white rounded-2xl shadow-2xl p-4 md:p-8"}>
                                <UploadZone file={file} onSelect={setFile} />

                                <button
                                    onClick={handleProcess}
                                    disabled={!file || loading}
                                    className="w-full bg-sky-600 hover:bg-sky-700 text-white py-5 rounded-xl font-bold disabled:opacity-50"
                                >
                                    <span id="btnText">{t("process.button")}</span>
                                </button>

                                {loading && <Progress text={progressText} logs={logs} showLogs={false} />}
                                {resultUrl && <Result url={resultUrl} fileName={file?.name} onReset={resetAll} />}
                                {error && <ErrorBox message={error?.message || error} details={error?.details} upgradeUrl={error?.upgradeUrl} />}
                            </div>

                            {resultUrl && (
                                <aside className="hidden lg:block">
                                    <SidebarPreview url={resultUrl} fileName={file?.name} />
                                </aside>
                            )}
                        </div>
                    </main>
                )}
                
                {currentPage === "plans" && <PlansPage onNavigate={setCurrentPage} />}
                {currentPage === "account" && <AccountPage onNavigate={setCurrentPage} />}
                
                
            </>
        );
    }

    return (
        <I18nProvider defaultLocale="en">
            <AuthProvider>
            <Header currentPage={currentPage} onNavigate={setCurrentPage} />
            <Routes>
                <Route path="/auth/callback" element={<AuthCallbackPage />} />
                <Route path="/plans" element={<PlansPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/api-keys" element={<ApiKeysPage />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/" element={<MainContent />} />
                <Route path="/home" element={<MainContent />} />

                {/* fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer />
            </AuthProvider>
        </I18nProvider>
    );
}

export default MainApp;