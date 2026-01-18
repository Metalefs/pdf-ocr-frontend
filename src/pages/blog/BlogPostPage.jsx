import { Fragment, useEffect, useMemo } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import BlogPostLayout from "../../components/BlogPostLayout";
import Markdown from "../../components/Markdown";
import RoiCalculator from "../../components/RoiCalculator";

import { useI18n } from "../../i18n";
import { getAllBlogPostsByLanguage, getBlogPostBySlug } from "./posts";
import { BlogPostSchema } from '../../components/SEOSchema';

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

function setAlternate(hreflang, href) {
  if (!hreflang || !href) return;
  const selector = `link[rel="alternate"][hreflang="${hreflang}"]`;
  let tag = document.querySelector(selector);
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "alternate");
    tag.setAttribute("hreflang", hreflang);
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

function stripFrontTitleHeading(markdown) {
  const text = String(markdown || "").trimStart();
  if (!text.startsWith("# ")) return markdown;
  const idx = text.indexOf("\n");
  if (idx === -1) return "";
  return text.slice(idx + 1).trimStart();
}

function extractToc(markdown) {
  const toc = [];
  const lines = String(markdown || "").split("\n");
  for (const line of lines) {
    const m = /^(##|###)\s+(.*)$/.exec(line.trim());
    if (!m) continue;

    const raw = m[2];
    const anchor = /<a\s+id="([^"]+)"\s*><\/a>/.exec(raw);
    const label = raw.replace(/<a\s+id="([^"]+)"\s*><\/a>/g, "").trim();
    const href = anchor ? `#${anchor[1]}` : null;

    if (!label || !href) continue;
    toc.push({ href, label });
  }

  return toc.slice(0, 12);
}

const ROI_CALCULATOR_TOKEN = "<!-- ROI_CALCULATOR -->";

function renderMarkdownWithEmbeds(markdown) {
  const raw = String(markdown || "");
  if (!raw.includes(ROI_CALCULATOR_TOKEN)) {
    return <Markdown content={raw} />;
  }

  const parts = raw.split(ROI_CALCULATOR_TOKEN);
  return (
    <>
      {parts.map((part, idx) => (
        <Fragment key={idx}>
          {part ? <Markdown content={part} /> : null}
          {idx < parts.length - 1 ? <RoiCalculator /> : null}
        </Fragment>
      ))}
    </>
  );
}

export default function BlogPostPage() {
  const { t, locale, setLocale } = useI18n();
  const navigate = useNavigate();
  const { lang, slug } = useParams();

  const language = useMemo(() => {
    if (lang === 'pt' || lang === 'en') return lang;
    return String(locale).toLowerCase().startsWith('pt') ? 'pt' : 'en';
  }, [lang, locale]);

  useEffect(() => {
    if (language !== locale) setLocale(language);
  }, [language, locale, setLocale]);

  const post = slug ? getBlogPostBySlug(slug, language) : null;
  const ptFallback = slug ? getBlogPostBySlug(slug, 'pt') : null;

  useEffect(() => {
    if (!slug) return;
    if (language === 'en' && !post && ptFallback) {
      navigate(`/pt/blog/${slug}`, { replace: true });
    }
  }, [language, navigate, post, ptFallback, slug]);

  const content = useMemo(() => {
    if (!post) return "";
    return stripFrontTitleHeading(post.content);
  }, [post]);

  const toc = useMemo(() => extractToc(post?.content), [post]);

  const relatedPosts = useMemo(() => {
    if (!post) return [];

    const all = getAllBlogPostsByLanguage(language).filter((p) => p.slug !== post.slug);
    const postTags = new Set((post.tags || []).map((x) => String(x).toLowerCase()));
    const postCategory = String(post.category || "").toLowerCase();

    const scored = all
      .map((candidate) => {
        let score = 0;
        if (postCategory && String(candidate.category || "").toLowerCase() === postCategory) score += 3;
        for (const tag of candidate.tags || []) {
          if (postTags.has(String(tag).toLowerCase())) score += 2;
        }
        if (candidate.featured) score += 0.5;
        return { candidate, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score);

    const picked = scored.map((x) => x.candidate).slice(0, 3);
    if (picked.length >= 2) return picked;

    return all.slice(0, 3);
  }, [post, language]);

  useEffect(() => {
    const baseUrl = "https://ocr-frontend.vercel.app";

    if (!post) {
      document.title = `${t('blog.notFoundTitle')} — ${t('blog.title')}`;
      setMeta('description', String(t('blog.notFoundBody') || ''));
      setCanonical(`${baseUrl}/${language}/blog`);
      return;
    }

    const pageTitle = `${post.title} — ${t('blog.title')}`;
    const canonical = `${baseUrl}/${language}/blog/${post.slug || slug}`;

    document.title = pageTitle;

    const description = post.seo?.description || post.excerpt || "";
    if (description) setMeta("description", description);

    const keywords = post.seo?.keywords;
    if (keywords) setMeta("keywords", keywords);

    setCanonical(canonical);
    setMetaProperty('og:type', 'article');
    setMetaProperty('og:title', pageTitle);
    setMetaProperty('og:description', description);
    setMetaProperty('og:url', canonical);
  }, [language, locale, post, slug, t]);

  useEffect(() => {
    if (!slug) return;

    const baseUrl = "https://ocr-frontend.vercel.app";
    const hasPt = Boolean(getBlogPostBySlug(slug, 'pt'));
    const hasEn = Boolean(getBlogPostBySlug(slug, 'en'));

    if (hasPt) setAlternate('pt-BR', `${baseUrl}/pt/blog/${slug}`);
    if (hasEn) setAlternate('en', `${baseUrl}/en/blog/${slug}`);
    if (hasPt) setAlternate('x-default', `${baseUrl}/pt/blog/${slug}`);
  }, [slug]);

  if (!post) {
    return (
      <>
      <BlogPostSchema post={post} lang={language} />
      <Box sx={{ bgcolor: "background.default", py: { xs: 3, md: 5 } }}>
        <Box sx={{ maxWidth: 900, mx: "auto", px: 2 }}>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack spacing={1.5}>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>
                  {t('blog.notFoundTitle')}
                </Typography>
                <Typography color="text.secondary">
                  {t('blog.notFoundBody')}
                </Typography>
                <Button component={RouterLink} to={`/${language}/blog`} variant="contained" sx={{ alignSelf: "flex-start" }}>
                  {t('blog.backToBlog')}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>
      </>
    );
  }

  const metaParts = [
    post.date ? formatDate(post.date, locale) : null,
    post.readTime ? t('blog.readTime', { count: post.readTime }) : null,
    post.author ? post.author : null,
  ].filter(Boolean);

  const meta = metaParts.join(" · ");

  const aside = (
    <Stack spacing={2}>
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            {t('blog.nextSteps')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t('blog.nextStepsBody')}
          </Typography>
          <Divider sx={{ my: 1.5 }} />
          <Stack spacing={1}>
            <Button component={RouterLink} to="/docs" variant="outlined">
              {t('blog.openDocs')}
            </Button>
            <Button component={RouterLink} to="/docs/api" variant="outlined">
              {t('blog.openApi')}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {relatedPosts.length ? (
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              {t('blog.relatedPosts')}
            </Typography>
            <Divider sx={{ my: 1.5 }} />
            <Stack spacing={0.75}>
              {relatedPosts.map((p) => (
                <Button
                  key={p.slug}
                  component={RouterLink}
                  to={`/${language}/blog/${p.slug}`}
                  variant="text"
                  sx={{ justifyContent: 'flex-start', textTransform: 'none', px: 0 }}
                >
                  {p.title}
                </Button>
              ))}
              <Button
                component={RouterLink}
                to={`/${language}/blog`}
                variant="outlined"
                sx={{ mt: 0.5, alignSelf: 'flex-start', textTransform: 'none' }}
              >
                {t('blog.backToBlog')}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      ) : null}
    </Stack>
  );

  return (
    <BlogPostLayout
      title={post.title}
      subtitle={post.excerpt}
      eyebrow={post.category || t('blog.title')}
      meta={meta}
      tags={post.tags}
      tocTitle={t('blog.onThisPage')}
      toc={toc}
      aside={aside}
    >
      {renderMarkdownWithEmbeds(content)}
    </BlogPostLayout>
  );
}
