import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import UploadZone from "./components/UploadZone";
import Progress from "./components/Progress";
import Result from "./components/Result";
import ErrorBox from "./components/ErrorBox";
import SidebarPreview from "./components/SidebarPreview";

import { processPdfAsync } from "./services/pdf.service";
import { getJobStatus, getJobDownloadUrl } from "./services/jobs.service";
import { I18nProvider, useI18n } from "./i18n";

export default function App() {
    const [file, setFile] = useState(null);
    // processing is asynchronous only
    const [loading, setLoading] = useState(false);
    const [progressText, setProgressText] = useState("");
    const [logs, setLogs] = useState([]);
    const [resultUrl, setResultUrl] = useState(null);
    const [error, setError] = useState(null);

    

    function resetAll() {
        setFile(null);
        setResultUrl(null);
        setLogs([]);
        setError(null);
        setLoading(false);
    }

    function MainContent() {
        const { t } = useI18n();

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
                setError(err.message);
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
                        } catch (e) {
                            setError(e.message || t("errors.generic"));
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
                    setError(err.message);
                    setLoading(false);
                }
            }, 1000);
        }

        return (
            <>
                <main className="max-w-7xl mx-auto h-full px-4 pb-16">

                    <section className="max-w-6xl mx-auto py-8 pb-2">
                        <div className="text-center mb-10">
                            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8">
                                {t("hero.title")}
                            </h2>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                {t("hero.subtitle")}
                            </p>
                        </div>
                    </section>


                    <div className="grid gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-2xl p-4 md:p-8">
                            <UploadZone file={file} onSelect={setFile} />

                            <button
                                onClick={handleProcess}
                                disabled={!file || loading}
                                className="w-full bg-sky-600 hover:bg-sky-700 text-white py-5 rounded-xl font-bold disabled:opacity-50"
                            >
                                <span id="btnText">{t("process.button")}</span>
                            </button>

                            {loading && <Progress text={progressText} logs={logs} />}
                            {resultUrl && <Result url={resultUrl} fileName={file?.name} onReset={resetAll} />}
                            {error && <ErrorBox message={error} />}
                        </div>

                        <aside className="hidden lg:block">
                            <SidebarPreview url={resultUrl} fileName={file?.name} />
                        </aside>
                    </div>
                </main>
            </>
        );
    }

    return (
        <I18nProvider defaultLocale={"en"}>
            <Header />
            <MainContent />
            <Footer />
        </I18nProvider>
    );
}
