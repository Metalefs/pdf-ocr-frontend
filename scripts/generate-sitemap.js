/* eslint-env node */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://ocr-frontend.vercel.app';
const OUTPUT_PATH = path.join(__dirname, '../public/sitemap.xml');

// Rotas estáticas
const staticRoutes = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/plans', priority: 0.9, changefreq: 'weekly' },
  { path: '/docs', priority: 0.9, changefreq: 'weekly' },
  { path: '/docs/api', priority: 0.8, changefreq: 'weekly' },
  { path: '/account', priority: 0.7, changefreq: 'monthly' },
  { path: '/blog', priority: 0.8, changefreq: 'weekly' },
  { path: '/contact', priority: 0.6, changefreq: 'monthly' },
];

// Função para extrair frontmatter de markdown
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  
  if (!match) return null;
  
  const frontmatter = {};
  const lines = match[1].split('\n');
  
  for (const line of lines) {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
      frontmatter[key.trim()] = value;
    }
  }
  
  return frontmatter;
}

// Ler posts do blog
function getBlogPosts() {
  const posts = [];
  const blogDirs = [
    path.join(__dirname, '../src/pages/blog'),
    path.join(__dirname, '../src/pages/blog/pt'),
    path.join(__dirname, '../src/pages/blog/en'),
  ];
  
  for (const dir of blogDirs) {
    if (!fs.existsSync(dir)) continue;
    
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.md') && f !== 'README.md');
    const lang = dir.endsWith('/pt') ? 'pt' : dir.endsWith('/en') ? 'en' : 'pt';
    
    for (const file of files) {
      const content = fs.readFileSync(path.join(dir, file), 'utf-8');
      const frontmatter = parseFrontmatter(content);
      
      if (frontmatter && frontmatter.slug) {
        posts.push({
          slug: frontmatter.slug,
          date: frontmatter.date || new Date().toISOString().split('T')[0],
          lang,
          priority: frontmatter.featured === 'true' ? 0.9 : 0.7,
        });
      }
    }
  }
  
  return posts;
}

// Gerar XML do sitemap
function generateSitemap() {
  const blogPosts = getBlogPosts();
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
  
  // Rotas estáticas
  for (const route of staticRoutes) {
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}${route.path}</loc>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
    xml += '  </url>\n';
  }
  
  // Posts do blog (PT e EN)
  const postsBySlug = {};
  
  for (const post of blogPosts) {
    if (!postsBySlug[post.slug]) {
      postsBySlug[post.slug] = { pt: null, en: null };
    }
    postsBySlug[post.slug][post.lang] = post;
  }
  
  for (const [slug, langs] of Object.entries(postsBySlug)) {
    const hasPt = langs.pt !== null;
    const hasEn = langs.en !== null;
    
    // Post PT
    if (hasPt) {
      xml += '  <url>\n';
      xml += `    <loc>${BASE_URL}/pt/blog/${slug}</loc>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>${langs.pt.priority}</priority>\n`;
      xml += `    <lastmod>${langs.pt.date}</lastmod>\n`;
      
      if (hasEn) {
        xml += `    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/en/blog/${slug}"/>\n`;
        xml += `    <xhtml:link rel="alternate" hreflang="pt" href="${BASE_URL}/pt/blog/${slug}"/>\n`;
      }
      
      xml += '  </url>\n';
    }
    
    // Post EN
    if (hasEn) {
      xml += '  <url>\n';
      xml += `    <loc>${BASE_URL}/en/blog/${slug}</loc>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>${langs.en.priority}</priority>\n`;
      xml += `    <lastmod>${langs.en.date}</lastmod>\n`;
      
      if (hasPt) {
        xml += `    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/en/blog/${slug}"/>\n`;
        xml += `    <xhtml:link rel="alternate" hreflang="pt" href="${BASE_URL}/pt/blog/${slug}"/>\n`;
      }
      
      xml += '  </url>\n';
    }
  }
  
  xml += '</urlset>\n';
  
  return xml;
}

// Main
try {
  const sitemap = generateSitemap();
  
  // Criar diretório public se não existir
  const publicDir = path.join(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  fs.writeFileSync(OUTPUT_PATH, sitemap, 'utf-8');
  console.log('✅ Sitemap gerado com sucesso em:', OUTPUT_PATH);
  
  const blogPosts = getBlogPosts();
  console.log(`📄 Total de URLs: ${staticRoutes.length + blogPosts.length}`);
  console.log(`📝 Posts do blog: ${blogPosts.length}`);
} catch (error) {
  console.error('❌ Erro ao gerar sitemap:', error);
  process.exit(1);
}