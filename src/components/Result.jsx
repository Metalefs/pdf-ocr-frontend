import { useI18n } from "../i18n";

export default function Result({ url, fileName, onReset }) {
    const { t } = useI18n();

    return (
        <div className="mt-8 bg-white border border-slate-100 p-6 rounded-xl flex justify-between items-center">
            <div>
                <p className="font-bold text-slate-800">{t("result.completed")}</p>
                <p className="text-slate-600">{fileName}</p>
            </div>
            <div className="flex items-center gap-3">
                <a href={url} download className="bg-sky-600 text-white px-4 py-2 rounded-lg font-bold">
                    {t("sidebar.download")}
                </a>

                <button onClick={onReset} className="text-sm text-slate-600 underline">
                    {t("process.another")}
                </button>
            </div>
        </div>
    );
}
