import { useEffect, useMemo } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useI18n } from "../../i18n";
import { getAllBlogPostsByLanguage } from "./posts";

function setMeta(name, content) {
  if (!content) return;
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setMetaProperty(property, content) {
  if (!content) return;
  let tag = document.querySelector(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setCanonical(href) {
  if (!href) return;
  let tag = document.querySelector('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "canonical");
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
}

function formatDate(iso, locale) {
  const value = String(iso || "").trim();
  if (!value) return "";
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  const lang = String(locale).toLowerCase().startsWith('pt') ? 'pt-BR' : 'en';
  const options = lang.startsWith('pt')
    ? { day: '2-digit', month: '2-digit', year: 'numeric' }
    : { day: '2-digit', month: 'short', year: 'numeric' };
  return new Intl.DateTimeFormat(lang, options).format(date);
}

export default function BlogIndexPage() {
  const { t, locale, setLocale } = useI18n();
  const navigate = useNavigate();
  const { lang } = useParams();

  const language = useMemo(() => {
    if (lang === 'pt' || lang === 'en') return lang;
    return String(locale).toLowerCase().startsWith('pt') ? 'pt' : 'en';
  }, [lang, locale]);

  const posts = getAllBlogPostsByLanguage(language);

  useEffect(() => {
    if (lang && lang !== 'pt' && lang !== 'en') {
      navigate(`/${language}/blog`, { replace: true });
    }
  }, [lang, language, navigate]);

  useEffect(() => {
    if (language !== locale) setLocale(language);
  }, [language, locale, setLocale]);

  useEffect(() => {
    const title = `${t('blog.title')}  TextLayer OCR`;
    const description = String(t('blog.subtitle') || '').trim();
    const baseUrl = "https://pdf-ocr-frontend.onrender.com";
    const canonical = `${baseUrl}/${language}/blog`;

    document.title = title;
    setMeta('description', description);
    setCanonical(canonical);

    setMetaProperty('og:type', 'website');
    setMetaProperty('og:title', title);
    setMetaProperty('og:description', description);
    setMetaProperty('og:url', canonical);
  }, [t, locale, language]);

  useEffect(() => {
    const baseUrl = "https://pdf-ocr-frontend.onrender.com";
    const alternates = [
      { hreflang: 'pt-BR', href: `${baseUrl}/pt/blog` },
      { hreflang: 'en', href: `${baseUrl}/en/blog` },
      { hreflang: 'x-default', href: `${baseUrl}/pt/blog` },
    ];

    for (const a of alternates) {
      const selector = `link[rel="alternate"][hreflang="${a.hreflang}"]`;
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement('link');
        tag.setAttribute('rel', 'alternate');
        tag.setAttribute('hreflang', a.hreflang);
        document.head.appendChild(tag);
      }
      tag.setAttribute('href', a.href);
    }
  }, [language]);

  const featured = posts.filter((p) => p.featured);
  const regular = posts.filter((p) => !p.featured);

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
                  {t('blog.title')}
                </Typography>
                <Chip
                  size="small"
                  label={String(locale).toLowerCase().startsWith('pt') ? 'Artigos' : 'Posts'}
                  sx={{ fontWeight: 800 }}
                />
              </Stack>
              <Typography color="text.secondary" sx={{ maxWidth: 980 }}>
                {t('blog.subtitle')}
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <Button component={RouterLink} to="/docs" variant="contained">
                  {t('blog.openDocs')}
                </Button>
                <Button component={RouterLink} to="/guides/pdfjs-font-encoding" variant="outlined">
                  {String(locale).toLowerCase().startsWith('pt') ? 'Guia (pdf.js)' : 'Guide (pdf.js)'}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>

        {featured.length > 0 ? (
          <Stack spacing={2} sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>
              {t('blog.featured')}
            </Typography>
            <Box
              sx={{
                display: { xs: "block", md: "grid" },
                gridTemplateColumns: { md: "repeat(2, minmax(0, 1fr))" },
                gap: 2,
              }}
            >
              {featured.map((post) => (
                <Card key={post.slug} variant="outlined" sx={{ borderRadius: 3 }}>
                  <CardActionArea component={RouterLink} to={`/${language}/blog/${post.slug}`} sx={{ height: "100%" }}>
                    <CardContent>
                      <Stack spacing={1}>
                        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                          {post.category ? <Chip size="small" label={post.category} variant="outlined" /> : null}
                          {post.readTime
                            ? <Chip size="small" label={t('blog.readTime', { count: post.readTime })} variant="outlined" />
                            : null}
                        </Stack>
                        <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: -0.2 }}>
                          {post.title}
                        </Typography>
                        {post.excerpt ? (
                          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                            {post.excerpt}
                          </Typography>
                        ) : null}
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                          {formatDate(post.date, locale)} {post.author ? `· ${post.author}` : ""}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </Box>
          </Stack>
        ) : null}

        <Divider sx={{ my: 3 }} />

        <Stack spacing={2}>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>
            {t('blog.allPosts')}
          </Typography>

          <Stack spacing={2}>
            {[...regular].map((post) => (
              <Card key={post.slug} variant="outlined" sx={{ borderRadius: 3 }}>
                <CardActionArea component={RouterLink} to={`/${language}/blog/${post.slug}`}>
                  <CardContent>
                    <Stack spacing={1}>
                      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ sm: "center" }}>
                        <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: -0.2, flex: 1 }}>
                          {post.title}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                          {post.category ? <Chip size="small" label={post.category} variant="outlined" /> : null}
                          {post.readTime
                            ? <Chip size="small" label={t('blog.readTime', { count: post.readTime })} variant="outlined" />
                            : null}
                        </Stack>
                      </Stack>

                      {post.excerpt ? (
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                          {post.excerpt}
                        </Typography>
                      ) : null}

                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                        {formatDate(post.date, locale)} {post.author ? `· ${post.author}` : ""}
                      </Typography>

                      {Array.isArray(post.tags) && post.tags.length ? (
                        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", pt: 0.5 }}>
                          {post.tags.slice(0, 6).map((tag) => (
                            <Chip key={tag} size="small" label={tag} />
                          ))}
                        </Stack>
                      ) : null}
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
