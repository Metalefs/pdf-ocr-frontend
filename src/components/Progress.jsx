import React, { useMemo, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function Progress({
    text,
    percent,
    logs,
    showLogs = true,
    variant = "loading",
    title,
    compact = false,
}) {
    const hasLogs = Array.isArray(logs) && logs.length > 0;
    const [logsOpen, setLogsOpen] = useState(false);

    const tone = useMemo(() => {
        switch (variant) {
            case "success":
                return "#107c10";
            case "error":
                return "#c50f1f";
            case "warning":
                return "#ffb900";
            case "info":
            case "loading":
            default:
                return "var(--metro-accent)";
        }
    }, [variant]);

    const role = variant === "error" ? "alert" : "status";
    const ariaLive = variant === "error" ? "assertive" : "polite";

    return (
        <Box
            component="section"
            sx={{ mt: compact ? 2 : 3 }}
            role={role}
            aria-live={ariaLive}
            aria-busy={variant === "loading" ? "true" : "false"}
        >
            <Paper variant="outlined" sx={{ p: 2, borderLeft: `4px solid ${tone}` }}>
                <Stack spacing={1}>
                    {variant === "loading" ? (
                        typeof percent === "number" && Number.isFinite(percent) ? (
                            <LinearProgress variant="determinate" value={Math.max(0, Math.min(100, percent))} />
                        ) : (
                            <LinearProgress />
                        )
                    ) : null}

                    {title ? (
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            {title}
                        </Typography>
                    ) : null}

                    <Typography variant="body2" color="text.secondary" sx={{ wordBreak: "break-word" }}>
                        {text}
                    </Typography>

                    {showLogs && hasLogs ? (
                        <Box>
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() => setLogsOpen((v) => !v)}
                                aria-expanded={logsOpen ? "true" : "false"}
                                sx={{ textTransform: "none" }}
                            >
                                {logsOpen ? "Hide logs" : `Show logs (${logs.length})`}
                            </Button>
                        </Box>
                    ) : null}
                </Stack>
            </Paper>

            <Collapse in={Boolean(showLogs && hasLogs && logsOpen)}>
                <Paper
                    variant="outlined"
                    className="log-container"
                    sx={{ mt: 2, p: 2, maxHeight: 224, overflowY: "auto" }}
                >
                    {logs.map((line, index) => (
                        <Typography key={index} variant="body2" sx={{ fontFamily: '"Courier New", monospace' }}>
                            {line}
                        </Typography>
                    ))}
                </Paper>
            </Collapse>
        </Box>
    );
}
