import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function CodeBlock({ title, code }) {
  const [copied, setCopied] = React.useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(String(code || ""));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        borderColor: "divider",
      }}
    >
      {(title || code) ? (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 1.5, py: 1, borderBottom: 1, borderColor: "divider", bgcolor: "background.paper" }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
            {title || ""}
          </Typography>
          <Button size="small" variant="text" onClick={handleCopy} sx={{ textTransform: "none" }}>
            {copied ? "Copied" : "Copy"}
          </Button>
        </Stack>
      ) : null}

      <Box
        component="pre"
        sx={{
          m: 0,
          p: 1.5,
          bgcolor: "action.hover",
          overflowX: "auto",
          fontSize: 13,
          lineHeight: 1.45,
        }}
      >
        <code>{code}</code>
      </Box>
    </Paper>
  );
}
