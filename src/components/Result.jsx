import { useI18n } from "../i18n";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function Result({ url, fileName, onReset }) {
    const { t } = useI18n();

    return (
        <Paper variant="outlined" sx={{ mt: 3, p: 2 }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "stretch", sm: "center" }} justifyContent="space-between">
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {t("result.completed")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {fileName}
                    </Typography>
                </Box>

                <Stack direction="row" spacing={1.5} justifyContent={{ xs: "flex-start", sm: "flex-end" }}>
                    <Button component="a" href={url} download variant="contained">
                        {t("sidebar.download")}
                    </Button>

                    <Button onClick={onReset} variant="text" color="inherit">
                        {t("process.another")}
                    </Button>
                </Stack>
            </Stack>
        </Paper>
    );
}
