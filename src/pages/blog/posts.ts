export type BlogPost = {
  slug: string;
  title: string;
  date?: string;
  author?: string;
  category?: string;
  tags: string[];
  excerpt?: string;
  featured?: boolean;
  readTime?: number;
  seo?: { description?: string; keywords?: string };
  content: string;
};

export type BlogLanguage = 'pt' | 'en';

type Frontmatter = {
  title?: string;
  slug?: string;
  date?: string;
  author?: string;
  category?: string;
  tags?: string[];
  excerpt?: string;
  featured?: boolean;
  readTime?: number;
  seo?: { description?: string; keywords?: string };
};

function stripQuotes(value: string) {
  const v = value.trim();
  if ((v.startsWith("\"") && v.endsWith("\"")) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1);
  }
  return v;
}

function parseScalar(value: string) {
  const v = stripQuotes(value);
  if (v === "true") return true;
  if (v === "false") return false;
  const n = Number(v);
  if (Number.isFinite(n) && v !== "") return n;
  return v;
}

function parseInlineArray(value: string) {
  const trimmed = value.trim();
  if (!trimmed.startsWith("[") || !trimmed.endsWith("]")) return null;
  const inner = trimmed.slice(1, -1).trim();
  if (!inner) return [];
  return inner
    .split(",")
    .map((s) => stripQuotes(s).trim())
    .filter(Boolean);
}

function parseFrontmatterYaml(front: string): Frontmatter {
  const data: Frontmatter = {};
  let section: string | null = null;

  const lines = String(front || "").split(/\r?\n/);
  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith("#")) continue;

    const isIndented = /^\s+/.test(line);
    const m = /^\s*([A-Za-z0-9_]+)\s*:\s*(.*)$/.exec(line);
    if (!m) continue;

    const key = m[1];
    const rawValue = m[2] ?? "";

    if (!isIndented) {
      section = null;
      if (!rawValue) {
        section = key;
        if (key === "seo") data.seo = {};
        continue;
      }

      const arr = parseInlineArray(rawValue);
      const parsed = arr ?? parseScalar(rawValue);

      if (key === "tags" && Array.isArray(parsed)) data.tags = parsed;
      else if (key === "featured" && typeof parsed === "boolean") data.featured = parsed;
      else if (key === "readTime" && typeof parsed === "number") data.readTime = parsed;
      else (data as any)[key] = parsed;

      continue;
    }

    // one-level nesting (e.g., seo.description)
    if (section === "seo") {
      if (!data.seo) data.seo = {};
      const parsed = parseScalar(rawValue);
      if (key === "description" && typeof parsed === "string") data.seo.description = parsed;
      if (key === "keywords" && typeof parsed === "string") data.seo.keywords = parsed;
    }
  }

  return data;
}

function parseFrontmatter(raw: string): { data: Frontmatter; content: string } {
  const text = String(raw || "");
  const lines = text.split(/\r?\n/);
  if (lines[0]?.trim() !== "---") return { data: {}, content: text };

  let end = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trim() === "---") {
      end = i;
      break;
    }
  }

  if (end === -1) return { data: {}, content: text };

  const front = lines.slice(1, end).join("\n");
  const content = lines.slice(end + 1).join("\n");
  return { data: parseFrontmatterYaml(front), content };
}

function safeNumber(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function estimateReadTimeMinutes(text: string) {
  const words = String(text || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#_*`>\-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return minutes;
}

function normalizeExcerpt(value: unknown, content: string) {
  if (typeof value === "string" && value.trim()) return value.trim();

  const lines = String(content || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => !l.startsWith("#"));

  const first = lines[0] || "";
  return first.length > 220 ? `${first.slice(0, 217)}...` : first;
}

function getFileSlugFromPath(path: string) {
  const base = path.split("/").pop() || path;
  return base.replace(/\.md$/i, "");
}

export function getAllBlogPosts(): BlogPost[] {
  const modulesRoot = import.meta.glob("./*.md", {
    eager: true,
    query: "?raw",
    import: "default",
  }) as Record<string, string>;

  const modulesPt = import.meta.glob("./pt/*.md", {
    eager: true,
    query: "?raw",
    import: "default",
  }) as Record<string, string>;

  // Treat legacy root posts as PT by default.
  const modules = { ...modulesRoot, ...modulesPt };

  const posts = Object.entries(modules)
    .map(([path, raw]) => {
      const parsed = parseFrontmatter(String(raw || ""));
      const data = (parsed.data || {}) as any;

      const slug = typeof data.slug === "string" && data.slug ? data.slug : getFileSlugFromPath(path);
      const title = typeof data.title === "string" && data.title ? data.title : undefined;

      if (!slug || !title) return null;

      const content = String(parsed.content || "");

      const tags = Array.isArray(data.tags) ? data.tags.filter((t: unknown) => typeof t === "string") : [];
      const readTime = safeNumber(data.readTime) ?? estimateReadTimeMinutes(content);
      const excerpt = normalizeExcerpt(data.excerpt, content);

      const seo = data.seo && typeof data.seo === "object"
        ? { description: data.seo.description, keywords: data.seo.keywords }
        : undefined;

      const post: BlogPost = {
        slug,
        title,
        date: typeof data.date === "string" ? data.date : undefined,
        author: typeof data.author === "string" ? data.author : undefined,
        category: typeof data.category === "string" ? data.category : undefined,
        tags,
        excerpt,
        featured: Boolean(data.featured),
        readTime,
        seo,
        content,
      };

      return post;
    })
    .filter(Boolean) as BlogPost[];

  posts.sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
  return posts;
}

export function getAllBlogPostsByLanguage(lang: BlogLanguage): BlogPost[] {
  if (lang === 'en') {
    const modulesEn = import.meta.glob("./en/*.md", {
      eager: true,
      query: "?raw",
      import: "default",
    }) as Record<string, string>;

    const posts = Object.entries(modulesEn)
      .map(([path, raw]) => {
        const parsed = parseFrontmatter(String(raw || ""));
        const data = (parsed.data || {}) as any;

        const slug = typeof data.slug === "string" && data.slug ? data.slug : getFileSlugFromPath(path);
        const title = typeof data.title === "string" && data.title ? data.title : undefined;

        if (!slug || !title) return null;

        const content = String(parsed.content || "");

        const tags = Array.isArray(data.tags) ? data.tags.filter((t: unknown) => typeof t === "string") : [];
        const readTime = safeNumber(data.readTime) ?? estimateReadTimeMinutes(content);
        const excerpt = normalizeExcerpt(data.excerpt, content);

        const seo = data.seo && typeof data.seo === "object"
          ? { description: data.seo.description, keywords: data.seo.keywords }
          : undefined;

        const post: BlogPost = {
          slug,
          title,
          date: typeof data.date === "string" ? data.date : undefined,
          author: typeof data.author === "string" ? data.author : undefined,
          category: typeof data.category === "string" ? data.category : undefined,
          tags,
          excerpt,
          featured: Boolean(data.featured),
          readTime,
          seo,
          content,
        };

        return post;
      })
      .filter(Boolean) as BlogPost[];

    posts.sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
    return posts;
  }

  return getAllBlogPosts();
}

export function getBlogPostBySlug(slug: string, lang?: BlogLanguage) {
  const posts = lang ? getAllBlogPostsByLanguage(lang) : getAllBlogPosts();
  return posts.find((p) => p.slug === slug) || null;
}
