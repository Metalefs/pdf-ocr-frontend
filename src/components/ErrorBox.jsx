import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export default function ErrorBox({ message, details, upgradeUrl }) {
    return (
        <Stack sx={{ mt: 3 }} spacing={1.5}>
            <Alert
                severity="error"
                action={
                    upgradeUrl ? (
                        <Button color="inherit" size="small" component="a" href={upgradeUrl}>
                            Upgrade plan
                        </Button>
                    ) : null
                }
            >
                <AlertTitle>{message}</AlertTitle>
                {details ? details : null}
            </Alert>
        </Stack>
    );
}
