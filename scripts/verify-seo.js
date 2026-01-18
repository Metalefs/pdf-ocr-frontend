import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://ocr-frontend.vercel.app';

console.log('🔍 Verificando configuração de SEO...\n');

let errors = 0;
let warnings = 0;

// 1. Verificar sitemap.xml
console.log('📄 Verificando sitemap.xml...');
const sitemapPath = path.join(__dirname, '../public/sitemap.xml');

if (!fs.existsSync(sitemapPath)) {
  console.error('❌ sitemap.xml não encontrado em public/');
  console.log('   Execute: npm run generate:sitemap\n');
  errors++;
} else {
  const sitemap = fs.readFileSync(sitemapPath, 'utf-8');
  
  // Verificar se tem conteúdo
  if (sitemap.length < 200) {
    console.error('❌ sitemap.xml está muito pequeno ou vazio');
    errors++;
  } else {
    console.log('✅ sitemap.xml existe e tem conteúdo');
    
    // Contar URLs
    const urlCount = (sitemap.match(/<loc>/g) || []).length;
    console.log(`   📊 ${urlCount} URLs no sitemap`);
    
    // Verificar formato XML
    if (!sitemap.includes('<?xml version="1.0"') || !sitemap.includes('</urlset>')) {
      console.error('❌ Formato XML inválido');
      errors++;
    }
    
    // Verificar se tem blog posts
    if (!sitemap.includes('/blog/')) {
      console.warn('⚠️  Nenhum post do blog encontrado no sitemap');
      warnings++;
    }
    
    // Verificar hreflang
    if (sitemap.includes('/blog/') && !sitemap.includes('hreflang')) {
      console.warn('⚠️  Posts do blog sem tags hreflang (multilíngue)');
      warnings++;
    }
  }
}

console.log();

// 2. Verificar robots.txt
console.log('🤖 Verificando robots.txt...');
const robotsPath = path.join(__dirname, '../public/robots.txt');

if (!fs.existsSync(robotsPath)) {
  console.error('❌ robots.txt não encontrado em public/');
  errors++;
} else {
  const robots = fs.readFileSync(robotsPath, 'utf-8');
  
  if (!robots.includes('Sitemap:')) {
    console.error('❌ robots.txt não declara o sitemap');
    errors++;
  } else {
    console.log('✅ robots.txt existe e declara o sitemap');
  }
  
  if (!robots.includes('User-agent:')) {
    console.error('❌ robots.txt sem User-agent');
    errors++;
  }
  
  // Verificar se permite crawling
  if (robots.includes('Disallow: /') && !robots.includes('Allow:')) {
    console.warn('⚠️  robots.txt pode estar bloqueando todo o site');
    warnings++;
  }
}

console.log();

// 3. Verificar componente SEOSchema
console.log('📋 Verificando componentes de schema...');
const schemaPath = path.join(__dirname, '../src/components/SEOSchema.jsx');

if (!fs.existsSync(schemaPath)) {
  console.error('❌ SEOSchema.jsx não encontrado');
  errors++;
} else {
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  
  const requiredSchemas = [
    'BlogPostSchema',
    'BlogListSchema',
    'OrganizationSchema',
    'SoftwareSchema',
    'TechArticleSchema',
  ];
  
  let missingSchemas = [];
  for (const schemaName of requiredSchemas) {
    if (!schema.includes(`export function ${schemaName}`)) {
      missingSchemas.push(schemaName);
    }
  }
  
  if (missingSchemas.length > 0) {
    console.error(`❌ Schemas faltando: ${missingSchemas.join(', ')}`);
    errors++;
  } else {
    console.log('✅ Todos os schemas estão implementados');
  }
  
  // Verificar se usa @context
  if (!schema.includes('@context')) {
    console.error('❌ Schemas sem @context');
    errors++;
  }
  
  // Verificar se remove ao desmontar
  if (!schema.includes('removeChild')) {
    console.warn('⚠️  Schemas podem não estar limpando ao desmontar');
    warnings++;
  }
}

console.log();

// 4. Verificar meta tags no index.html
console.log('🏷️  Verificando meta tags...');
const indexPath = path.join(__dirname, '../index.html');

if (fs.existsSync(indexPath)) {
  const html = fs.readFileSync(indexPath, 'utf-8');
  
  const requiredMetaTags = [
    { name: 'description', pattern: /<meta name="description"/ },
    { name: 'viewport', pattern: /<meta name="viewport"/ },
    { name: 'og:title', pattern: /<meta property="og:title"/ },
    { name: 'og:description', pattern: /<meta property="og:description"/ },
    { name: 'og:url', pattern: /<meta property="og:url"/ },
  ];
  
  let missingMeta = [];
  for (const meta of requiredMetaTags) {
    if (!meta.pattern.test(html)) {
      missingMeta.push(meta.name);
    }
  }
  
  if (missingMeta.length > 0) {
    console.warn(`⚠️  Meta tags faltando: ${missingMeta.join(', ')}`);
    warnings++;
  } else {
    console.log('✅ Meta tags básicas presentes');
  }
  
  // Verificar canonical
  if (!html.includes('<link rel="canonical"')) {
    console.warn('⚠️  Link canonical não encontrado');
    warnings++;
  }
} else {
  console.warn('⚠️  index.html não encontrado (normal para SPA)');
}

console.log();

// 5. Verificar package.json
console.log('📦 Verificando package.json...');
const packagePath = path.join(__dirname, '../package.json');

if (fs.existsSync(packagePath)) {
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
  
  if (!pkg.scripts || !pkg.scripts['generate:sitemap']) {
    console.error('❌ Script generate:sitemap não encontrado em package.json');
    errors++;
  } else {
    console.log('✅ Script generate:sitemap configurado');
  }
  
  // Verificar se build gera sitemap
  if (pkg.scripts.build && !pkg.scripts.build.includes('generate:sitemap')) {
    console.warn('⚠️  npm run build não gera sitemap automaticamente');
    console.log('   Adicione: "build": "npm run generate:sitemap && vite build"');
    warnings++;
  }
}

console.log();

// 6. Verificar blog posts
console.log('📝 Verificando blog posts...');
const blogDir = path.join(__dirname, '../src/pages/blog');

if (fs.existsSync(blogDir)) {
  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md') && f !== 'README.md');
  console.log(`✅ ${files.length} posts encontrados na raiz`);
  
  // Verificar posts PT
  const ptDir = path.join(blogDir, 'pt');
  if (fs.existsSync(ptDir)) {
    const ptFiles = fs.readdirSync(ptDir).filter(f => f.endsWith('.md') && f !== 'README.md');
    console.log(`✅ ${ptFiles.length} posts em PT`);
  } else {
    console.warn('⚠️  Diretório blog/pt não encontrado');
  }
  
  // Verificar posts EN
  const enDir = path.join(blogDir, 'en');
  if (fs.existsSync(enDir)) {
    const enFiles = fs.readdirSync(enDir).filter(f => f.endsWith('.md') && f !== 'README.md');
    console.log(`✅ ${enFiles.length} posts em EN`);
  } else {
    console.warn('⚠️  Diretório blog/en não encontrado');
  }
  
  // Verificar frontmatter em um post de exemplo
  if (files.length > 0) {
    const samplePost = fs.readFileSync(path.join(blogDir, files[0]), 'utf-8');
    if (!samplePost.includes('---') || !samplePost.includes('slug:')) {
      console.warn('⚠️  Posts podem estar sem frontmatter correto');
      warnings++;
    }
  }
} else {
  console.error('❌ Diretório blog não encontrado');
  errors++;
}

console.log();

// Resumo final
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 RESUMO DA VERIFICAÇÃO');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

if (errors === 0 && warnings === 0) {
  console.log('✅ Tudo perfeito! SEO configurado corretamente.');
  console.log('\n🚀 Próximos passos:');
  console.log('   1. Fazer build: npm run build');
  console.log('   2. Deploy no Vercel');
  console.log('   3. Submeter sitemap ao Google Search Console');
  console.log('   4. Testar rich results: https://search.google.com/test/rich-results');
} else {
  if (errors > 0) {
    console.log(`❌ ${errors} erro(s) crítico(s) encontrado(s)`);
  }
  if (warnings > 0) {
    console.log(`⚠️  ${warnings} aviso(s) encontrado(s)`);
  }
  
  console.log('\n🔧 Corrija os problemas acima antes de fazer deploy.');
}

console.log();

// Exit code
process.exit(errors > 0 ? 1 : 0);