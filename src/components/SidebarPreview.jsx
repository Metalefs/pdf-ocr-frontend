import React from "react";
import { useI18n } from "../i18n";

export default function SidebarPreview({ url, fileName }) {
    const { t } = useI18n();

    return (
        <div className="sidebar-preview metro-surface p-4 sticky top-24 h-full rounded-lg">

            {!url && (
                <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400">
                    <div className="text-6xl">📄</div>
                    <p className="mt-3">{t("sidebar.none")}</p>
                    <p className="text-sm text-slate-400 mt-1">{t("sidebar.sendPdf")}</p>
                </div>
            )}

            {url && (
                <div className="preview-wrapper bg-white overflow-hidden border border-slate-200 h-full">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                        <div className="text-sm font-medium text-slate-800 truncate">{fileName || t("sidebar.title")}</div>
                        <div className="flex gap-2 items-center">
                            <a href={url} target="_blank" rel="noreferrer" className="text-sky-600 hover:underline text-sm">{t("sidebar.open")}</a>
                            <a href={url} download className="metro-btn-primary px-3 py-1 text-sm font-semibold">{t("sidebar.download")}</a>
                        </div>
                    </div>

                    <div className="h-full overflow-hidden">
                        <iframe title="preview" src={url} className="w-full h-full" />
                    </div>
                </div>
            )}
        </div>
    );
}
