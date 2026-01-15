import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export default function ErrorBox({ message, details, upgradeUrl, onRetry, retryLabel }) {
    return (
        <Stack sx={{ mt: 3 }} spacing={1.5}>
            <Alert
                severity="error"
                action={
                    (upgradeUrl || onRetry) ? (
                        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                            {onRetry ? (
                                <Button color="inherit" size="small" onClick={onRetry}>
                                    {retryLabel || "Try again"}
                                </Button>
                            ) : null}
                            {upgradeUrl ? (
                                <Button color="inherit" size="small" component="a" href={upgradeUrl}>
                                    Upgrade plan
                                </Button>
                            ) : null}
                        </Stack>
                    ) : null
                }
            >
                <AlertTitle>{message}</AlertTitle>
                {details ? details : null}
            </Alert>
        </Stack>
    );
}
