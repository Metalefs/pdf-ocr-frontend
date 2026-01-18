import { useEffect } from 'react';

function getPublicSiteUrl() {
  const envUrl = (import.meta?.env?.VITE_PUBLIC_SITE_URL || '').trim();
  const fallback = typeof window !== 'undefined' ? window.location.origin : 'https://example.com';
  return (envUrl || fallback).replace(/\/+$/, '');
}

function writeJsonLd(id, schema) {
  const existing = document.getElementById(id);
  if (existing) existing.remove();

  const scriptTag = document.createElement('script');
  scriptTag.type = 'application/ld+json';
  scriptTag.id = id;
  scriptTag.text = JSON.stringify(schema);
  document.head.appendChild(scriptTag);

  return () => {
    const current = document.getElementById(id);
    if (current) current.remove();
  };
}

/**
 * Componente para adicionar JSON-LD structured data
 * Melhora SEO e rich snippets nos resultados de busca
 */
export function BlogPostSchema({ post, lang = 'pt' }) {
  useEffect(() => {
    if (!post) return;

    const baseUrl = getPublicSiteUrl();
    const articleUrl = `${baseUrl}/${lang}/blog/${post.slug}`;
    
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': post.title,
      'description': post.excerpt || post.seo?.description,
      'url': articleUrl,
      'datePublished': post.date,
      'dateModified': post.date,
      'author': {
        '@type': 'Organization',
        'name': 'TextLayer OCR',
        'url': baseUrl,
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'TextLayer OCR',
        'logo': {
          '@type': 'ImageObject',
          'url': `${baseUrl}/logo.png`,
        },
      },
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': articleUrl,
      },
      'articleSection': post.category || 'Technology',
      'keywords': post.tags?.join(', ') || '',
      'inLanguage': lang === 'pt' ? 'pt-BR' : 'en-US',
    };

    return writeJsonLd('blog-post-schema', schema);
  }, [post, lang]);

  return null; // Componente não renderiza nada
}

/**
 * Schema para a página de listagem do blog
 */
export function BlogListSchema({ posts = [], lang = 'pt' }) {
  useEffect(() => {
    const baseUrl = getPublicSiteUrl();
    
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      'name': 'TextLayer OCR Blog',
      'description': 'Technical articles about OCR, PDF processing, and document automation',
      'url': `${baseUrl}/${lang}/blog`,
      'inLanguage': lang === 'pt' ? 'pt-BR' : 'en-US',
      'blogPost': posts.slice(0, 10).map(post => ({
        '@type': 'BlogPosting',
        'headline': post.title,
        'url': `${baseUrl}/${lang}/blog/${post.slug}`,
        'datePublished': post.date,
      })),
    };

    return writeJsonLd('blog-list-schema', schema);
  }, [posts, lang]);

  return null;
}

/**
 * Schema para página de documentação
 */
export function TechArticleSchema({ title, description, url }) {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      'headline': title,
      'description': description,
      'url': url,
      'author': {
        '@type': 'Organization',
        'name': 'TextLayer OCR',
      },
    };

    return writeJsonLd('tech-article-schema', schema);
  }, [title, description, url]);

  return null;
}

/**
 * Schema para organização (usar na home)
 */
export function OrganizationSchema() {
  useEffect(() => {
    const baseUrl = getPublicSiteUrl();

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'TextLayer OCR',
      'url': baseUrl,
      'logo': `${baseUrl}/logo.png`,
      'description': 'Professional OCR platform for PDF processing and document automation',
      'sameAs': [
        // Adicionar redes sociais quando disponíveis
        // 'https://twitter.com/textlayerocr',
        // 'https://github.com/textlayerocr',
      ],
      'contactPoint': {
        '@type': 'ContactPoint',
        'contactType': 'Customer Support',
        'email': 'support@textlayerocr.com',
      },
    };

    return writeJsonLd('organization-schema', schema);
  }, []);

  return null;
}

/**
 * Schema para SoftwareApplication (usar na página de planos)
 */
export function SoftwareSchema({ plans = [], lang = 'pt' }) {
  useEffect(() => {
    const baseUrl = getPublicSiteUrl();
    const plansUrl = `${baseUrl}/plans`;

    const normalizedPlans = Array.isArray(plans) ? plans : [];
    const offersList = normalizedPlans
      .map((plan) => {
        const id = plan?.id ?? plan?.Id ?? '';
        const name = plan?.name ?? plan?.Name ?? '';
        const description = plan?.description ?? plan?.Description ?? '';
        const currency = (plan?.currency ?? plan?.Currency ?? 'USD').toString().toUpperCase();
        const interval = plan?.interval ?? plan?.Interval ?? 'month';
        const price = Number(plan?.price ?? plan?.Price ?? 0);

        const safeId = id || name;
        if (!safeId) return null;

        return {
          id: safeId.toString(),
          name: name || safeId.toString(),
          description: description || undefined,
          currency,
          interval: interval || 'month',
          price: Number.isFinite(price) ? price : 0,
        };
      })
      .filter(Boolean);

    const currency = offersList.find(o => o.currency)?.currency || 'USD';
    const prices = offersList.map(o => Number(o.price)).filter(p => Number.isFinite(p));
    const lowPrice = prices.length ? Math.min(...prices) : 0;
    const highPrice = prices.length ? Math.max(...prices) : 0;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'TextLayer OCR',
      'applicationCategory': 'BusinessApplication',
      'operatingSystem': 'Web',
      'url': plansUrl,
      'inLanguage': lang === 'pt' ? 'pt-BR' : 'en-US',
      'publisher': {
        '@type': 'Organization',
        'name': 'TextLayer OCR',
        'url': baseUrl,
        'logo': {
          '@type': 'ImageObject',
          'url': `${baseUrl}/logo.png`,
        },
      },
      'offers': {
        '@type': 'AggregateOffer',
        'lowPrice': lowPrice,
        'highPrice': highPrice,
        'priceCurrency': currency,
        'offerCount': offersList.length,
        ...(offersList.length
          ? {
              'offers': offersList.map((o) => ({
                '@type': 'Offer',
                'name': o.name,
                ...(o.description ? { 'description': o.description } : {}),
                'price': o.price,
                'priceCurrency': o.currency,
                'availability': 'https://schema.org/InStock',
                'url': plansUrl,
                'priceSpecification': {
                  '@type': 'UnitPriceSpecification',
                  'price': o.price,
                  'priceCurrency': o.currency,
                  'unitText': o.interval,
                },
              })),
            }
          : {}),
      },
      'description': 'Professional OCR platform for converting scanned PDFs to searchable documents without flattening or rebuilding the PDF',
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': plansUrl,
      },
    };

    return writeJsonLd('software-schema', schema);
  }, [plans, lang]);

  return null;
}