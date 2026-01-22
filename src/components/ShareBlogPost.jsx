import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";

// Social icons from Material-UI
import ShareIcon from "@mui/icons-material/Share";
import LinkIcon from "@mui/icons-material/Link";
import XIcon from "@mui/icons-material/X";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

import { useI18n } from "../i18n";

export default function ShareBlogPost({ title, url }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const shareText = `${title} - ${url}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(shareText);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setOpenSnackbar(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `${t('blog.share.checkThis')}: ${title}`,
          url: url,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    }
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedText}`,
  };

  const handleSocialShare = (platform) => {
    const width = 500;
    const height = 500;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    const features = `width=${width},height=${height},left=${left},top=${top}`;
    
    window.open(shareLinks[platform], "_blank", features);
  };

  return (
    <Box>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="center" sx={{ mb: 2 }}>
        {navigator.share && (
          <Button
            variant="outlined"
            startIcon={<ShareIcon />}
            onClick={handleWebShare}
            size="small"
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderColor: "divider",
              "&:hover": {
                borderColor: "primary.main",
                bgcolor: "action.hover",
              },
            }}
          >
            {t("blog.share.shareButton")}
          </Button>
        )}

        <Stack direction="row" spacing={0.5}>
          <Tooltip title={t("blog.share.twitter")}>
            <IconButton
              size="small"
              onClick={() => handleSocialShare("twitter")}
              sx={{
                color: "#1D9BF0",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <XIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={t("blog.share.linkedin")}>
            <IconButton
              size="small"
              onClick={() => handleSocialShare("linkedin")}
              sx={{
                color: "#0A66C2",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <LinkedInIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={t("blog.share.facebook")}>
            <IconButton
              size="small"
              onClick={() => handleSocialShare("facebook")}
              sx={{
                color: "#1877F2",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <FacebookIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={t("blog.share.whatsapp")}>
            <IconButton
              size="small"
              onClick={() => handleSocialShare("whatsapp")}
              sx={{
                color: "#25D366",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <WhatsAppIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={copied ? t("blog.share.copied") : t("blog.share.copyLink")}>
            <IconButton
              size="small"
              onClick={handleCopyLink}
              sx={{
                color: copied ? "success.main" : "text.secondary",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <LinkIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: "100%" }}>
          {t("blog.share.linkCopied")}
        </Alert>
      </Snackbar>
    </Box>
  );
}
