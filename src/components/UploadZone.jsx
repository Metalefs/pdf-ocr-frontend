import { useI18n } from "../i18n";
import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

export default function UploadZone({ file, onSelect }) {
    const { t } = useI18n();
    const [isDragOver, setIsDragOver] = React.useState(false);

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
        setIsDragOver(false);
        handleFile(e.dataTransfer.files?.[0]);
    }

    function onDragOver(e) {
        e.preventDefault();
        setIsDragOver(true);
    }

    function onDragLeave() {
        setIsDragOver(false);
    }

    return (
        <Paper
            id="uploadZone"
            variant="outlined"
            onClick={() => document.getElementById("fileInput")?.click()}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            sx={{
                p: { xs: 2.5, md: 4 },
                mb: 3,
                cursor: "pointer",
                borderStyle: "dashed",
                borderWidth: 2,
                borderColor: isDragOver ? "primary.main" : "divider",
                bgcolor: isDragOver ? "action.hover" : "background.paper",
                transition: "background-color 160ms ease, border-color 160ms ease",
            }}
        >
            <input
                id="fileInput"
                type="file"
                accept=".pdf"
                hidden
                onChange={onInputChange}
            />

            {!file ? (
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "flex-start", sm: "center" }}>
                    <CloudUploadIcon color="primary" sx={{ fontSize: 56 }} />
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {t("upload.promptTitle")}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {t("upload.promptSubtitle")}
                        </Typography>
                        <Button
                            variant="outlined"
                            size="small"
                            sx={{ mt: 1.5, textTransform: "none" }}
                            onClick={(e) => {
                                e.stopPropagation();
                                document.getElementById("fileInput")?.click();
                            }}
                        >
                            Choose PDF
                        </Button>
                    </Box>
                </Stack>
            ) : (
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "flex-start", sm: "center" }}>
                    <PictureAsPdfIcon color="primary" sx={{ fontSize: 56 }} />
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {file.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                        </Typography>
                        <Button
                            variant="text"
                            size="small"
                            sx={{ mt: 1, textTransform: "none" }}
                            onClick={(e) => {
                                e.stopPropagation();
                                document.getElementById("fileInput")?.click();
                            }}
                        >
                            {t("upload.chooseAnother")}
                        </Button>
                    </Box>
                </Stack>
            )}

            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
                {t("upload.multilangNote")}
            </Typography>
        </Paper>
    );
}
