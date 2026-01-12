import React from "react";
import { useI18n } from "../i18n";

export default function SidebarPreview({ url, fileName }) {
    const { t } = useI18n();

    return (
        <div className="sidebar-preview bg-white rounded-2xl p-4 shadow sticky top-24 ">
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-bold text-slate-800">{t("sidebar.title")}</h4>
                <span className="text-sm text-slate-500">{t("sidebar.preserve")}</span>
            </div>

            {!url && (
                <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400">
                    <div className="text-6xl">📄</div>
                    <p className="mt-3">{t("sidebar.none")}</p>
                    <p className="text-sm text-slate-400 mt-1">{t("sidebar.sendPdf")}</p>
                </div>
            )}

            {url && (
                <div className="preview-wrapper bg-white rounded-lg overflow-hidden border border-slate-100  h-full">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                        <div className="text-sm font-medium text-slate-800 truncate">{fileName || t("sidebar.title")}</div>
                        <div className="flex gap-2">
                            <a href={url} target="_blank" rel="noreferrer" className="text-sky-600 hover:underline text-sm">{t("sidebar.open")}</a>
                            <a href={url} download className="bg-sky-600 text-white px-3 py-1 rounded text-sm">{t("sidebar.download")}</a>
                        </div>
                    </div>

                    <div className="h-full overflow-hidden" style={{ height: '480px' }}>
                        <iframe title="preview" src={url} className="w-full h-full" />
                    </div>
                </div>
            )}
        </div>
    );
}
