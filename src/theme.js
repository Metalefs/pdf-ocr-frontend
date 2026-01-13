import { createTheme } from "@mui/material/styles";

export const materialTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#1976d2",
        },
        secondary: {
            main: "#7c4dff",
        },
        background: {
            default: "#f5f5f5",
            paper: "#ffffff",
        },
    },
    shape: {
        borderRadius: 12,
    },
    typography: {
        fontFamily: [
            "Roboto",
            "system-ui",
            "-apple-system",
            "Segoe UI",
            "Helvetica Neue",
            "Arial",
            "Noto Sans",
            "Liberation Sans",
            "sans-serif",
        ].join(","),
    },
    components: {
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
        },
    },
});
