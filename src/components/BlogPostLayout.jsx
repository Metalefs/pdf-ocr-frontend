import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import ShareBlogPost from "./ShareBlogPost";

export default function BlogPostLayout({
  title,
  subtitle,
  eyebrow,
  meta,
  tags,
  toc,
  tocTitle,
  children,
  aside,
  url,
}) {
  const hasToc = Array.isArray(toc) && toc.length > 0;
  const hasTags = Array.isArray(tags) && tags.length > 0;

  return (
    <Box sx={{ bgcolor: "background.default", py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <Paper
          variant="outlined"
          sx={(theme) => ({
            mb: 3,
            borderRadius: 4,
            borderColor: "divider",
            overflow: "hidden",
            background: `linear-gradient(135deg, rgba(99,102,241,0.10) 0%, rgba(14,165,233,0.08) 45%, ${theme.palette.background.paper} 100%)`,
          })}
        >
          <Box sx={{ p: { xs: 2.5, md: 3 } }}>
            <Stack spacing={1.25}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "flex-start", sm: "center" }}>
                <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -0.5, lineHeight: 1.1 }}>
                  {title}
                </Typography>
                {eyebrow ? (
                  <Chip size="small" label={eyebrow} sx={{ fontWeight: 800 }} />
                ) : null}
              </Stack>

              {subtitle ? (
                <Typography color="text.secondary" sx={{ maxWidth: 980 }}>
                  {subtitle}
                </Typography>
              ) : null}

              {meta ? (
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  {meta}
                </Typography>
              ) : null}

              {url && title ? (
                <Box sx={{ mt: 1 }}>
                  <ShareBlogPost title={title} url={url} />
                </Box>
              ) : null}

              {hasTags ? (
                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                  {tags.map((tag) => (
                    <Chip key={tag} size="small" label={tag} variant="outlined" />
                  ))}
                </Stack>
              ) : null}
            </Stack>
          </Box>
        </Paper>

        <Box
          sx={{
            display: { xs: "block", md: "grid" },
            gridTemplateColumns: { md: "minmax(0, 1fr) 340px" },
            gap: 2,
          }}
        >
          <Paper variant="outlined" sx={{ borderRadius: 3, p: { xs: 2, md: 3 } }}>
            {children}
          </Paper>

          <Stack spacing={2} sx={{ mt: { xs: 2, md: 0 }, position: { md: "sticky" }, top: { md: 88 }, alignSelf: { md: "start" } }}>
            {hasToc ? (
              <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>
                    {tocTitle || "On this page"}
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Stack spacing={1}>
                    {toc.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        underline="hover"
                        color="text.primary"
                        sx={{ fontWeight: 700 }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            ) : null}

            {aside ? aside : null}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
