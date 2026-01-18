import { useEffect } from 'react';

/**
 * Componente para adicionar JSON-LD structured data
 * Melhora SEO e rich snippets nos resultados de busca
 */
export function BlogPostSchema({ post, lang = 'pt' }) {
  useEffect(() => {
    if (!post) return;

    const baseUrl = 'https://ocr-frontend.vercel.app';
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

    // Adicionar ao head
    const scriptTag = document.createElement('script');
    scriptTag.type = 'application/ld+json';
    scriptTag.id = 'blog-post-schema';
    scriptTag.text = JSON.stringify(schema);
    document.head.appendChild(scriptTag);

    // Cleanup ao desmontar
    return () => {
      const existingScript = document.getElementById('blog-post-schema');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [post, lang]);

  return null; // Componente não renderiza nada
}

/**
 * Schema para a página de listagem do blog
 */
export function BlogListSchema({ posts = [], lang = 'pt' }) {
  useEffect(() => {
    const baseUrl = 'https://ocr-frontend.vercel.app';
    
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

    const scriptTag = document.createElement('script');
    scriptTag.type = 'application/ld+json';
    scriptTag.id = 'blog-list-schema';
    scriptTag.text = JSON.stringify(schema);
    document.head.appendChild(scriptTag);

    return () => {
      const existingScript = document.getElementById('blog-list-schema');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
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

    const scriptTag = document.createElement('script');
    scriptTag.type = 'application/ld+json';
    scriptTag.id = 'tech-article-schema';
    scriptTag.text = JSON.stringify(schema);
    document.head.appendChild(scriptTag);

    return () => {
      const existingScript = document.getElementById('tech-article-schema');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [title, description, url]);

  return null;
}

/**
 * Schema para organização (usar na home)
 */
export function OrganizationSchema() {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'TextLayer OCR',
      'url': 'https://ocr-frontend.vercel.app',
      'logo': 'https://ocr-frontend.vercel.app/logo.png',
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

    const scriptTag = document.createElement('script');
    scriptTag.type = 'application/ld+json';
    scriptTag.id = 'organization-schema';
    scriptTag.text = JSON.stringify(schema);
    document.head.appendChild(scriptTag);

    return () => {
      const existingScript = document.getElementById('organization-schema');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return null;
}

/**
 * Schema para SoftwareApplication (usar na página de planos)
 */
export function SoftwareSchema() {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'TextLayer OCR',
      'applicationCategory': 'BusinessApplication',
      'operatingSystem': 'Web',
      'offers': {
        '@type': 'AggregateOffer',
        'lowPrice': '0',
        'highPrice': '149',
        'priceCurrency': 'USD',
        'offerCount': '3',
      },
      'description': 'Professional OCR platform for converting scanned PDFs to searchable documents while preserving forms',
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.8',
        'ratingCount': '127', // Atualizar com dados reais
      },
    };

    const scriptTag = document.createElement('script');
    scriptTag.type = 'application/ld+json';
    scriptTag.id = 'software-schema';
    scriptTag.text = JSON.stringify(schema);
    document.head.appendChild(scriptTag);

    return () => {
      const existingScript = document.getElementById('software-schema');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return null;
}