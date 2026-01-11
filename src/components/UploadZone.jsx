import { useI18n } from "../i18n";

export default function UploadZone({ file, onSelect }) {
    const { t } = useI18n();

    function handleFile(file) {
        if (!file) return;

        if (!file.name.toLowerCase().endsWith(".pdf")) return;
        if (file.size > 10_000_000) return;

        onSelect(file);
    }

    function onInputChange(e) {
        handleFile(e.target.files?.[0]);
    }

    function onDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove("dragover");
        handleFile(e.dataTransfer.files?.[0]);
    }

    function onDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add("dragover");
    }

    function onDragLeave(e) {
        e.currentTarget.classList.remove("dragover");
    }

    return (
        <div
            id="uploadZone"
            className="upload-zone rounded-xl p-16 text-center cursor-pointer mb-8 bg-gray-50"
            onClick={() => document.getElementById("fileInput")?.click()}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
        >
            <input
                id="fileInput"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={onInputChange}
            />

            {/* Upload Prompt */}
            {!file && (
                <div id="uploadPrompt">
                    <svg
                        className="mx-auto h-20 w-20 text-rose-500 mb-4 accent-emoji"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                    </svg>

                    <p className="text-xl font-semibold text-slate-700 mb-2">
                        {t("upload.promptTitle")}
                    </p>
                    <p className="text-slate-400">
                        {t("upload.promptSubtitle")}
                    </p>
                </div>
            )}

            {/* File Info */}
            {file && (
                <div id="fileInfo">
                    <svg
                        className="mx-auto h-16 w-16 text-rose-500 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>

                    <p className="text-xl font-semibold text-slate-700">
                        {file.name}
                    </p>

                    <p className="text-gray-500 mt-1">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>

                    <button
                        type="button"
                        className="mt-4 text-slate-600 hover:text-slate-800 underline"
                        onClick={(e) => {
                            e.stopPropagation();
                            document.getElementById("fileInput")?.click();
                        }}
                    >
                        {t("upload.chooseAnother")}
                    </button>
                </div>
            )}
        </div>
    );
}
