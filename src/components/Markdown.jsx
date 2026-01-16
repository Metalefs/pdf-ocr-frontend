import React from "react";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

import CodeBlock from "./CodeBlock";

function isProbablyExternal(href) {
  return typeof href === "string" && /^(https?:)?\/\//i.test(href);
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{Diacritic}+/gu, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractText(children) {
  if (children == null) return "";
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(extractText).join("");
  if (React.isValidElement(children)) return extractText(children.props?.children);
  return "";
}

function extractExplicitAnchorId(children) {
  const nodes = Array.isArray(children) ? children : [children];
  for (const node of nodes) {
    if (!React.isValidElement(node)) continue;
    const tag = String(node.type || "").toLowerCase();
    if (tag !== "a") continue;
    const id = node.props?.id;
    const href = node.props?.href;
    if (typeof id === "string" && id && !href) return id;
  }
  return null;
}

export default function Markdown({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSanitize]}
      components={{
        p({ children }) {
          return (
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.75, mb: 2 }}>
              {children}
            </Typography>
          );
        },
        a({ href, children }) {
          const external = isProbablyExternal(href);
          return (
            <Link
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
              underline="hover"
              sx={{ fontWeight: 700 }}
            >
              {children}
            </Link>
          );
        },
        h1({ children }) {
          const id = extractExplicitAnchorId(children) || slugify(extractText(children));
          return (
            <Typography id={id} variant="h4" sx={{ fontWeight: 900, letterSpacing: -0.3, mt: 2, mb: 1.25 }}>
              {children}
            </Typography>
          );
        },
        h2({ children }) {
          const id = extractExplicitAnchorId(children) || slugify(extractText(children));
          return (
            <Typography id={id} variant="h5" sx={{ fontWeight: 900, letterSpacing: -0.2, mt: 3, mb: 1.25 }}>
              {children}
            </Typography>
          );
        },
        h3({ children }) {
          const id = extractExplicitAnchorId(children) || slugify(extractText(children));
          return (
            <Typography id={id} variant="h6" sx={{ fontWeight: 900, mt: 2.5, mb: 1 }}>
              {children}
            </Typography>
          );
        },
        ul({ children }) {
          return (
            <Box component="ul" sx={{ pl: 3, mb: 2, color: "text.secondary", lineHeight: 1.75 }}>
              {children}
            </Box>
          );
        },
        ol({ children }) {
          return (
            <Box component="ol" sx={{ pl: 3, mb: 2, color: "text.secondary", lineHeight: 1.75 }}>
              {children}
            </Box>
          );
        },
        li({ children }) {
          return <Box component="li" sx={{ mb: 0.5 }}>{children}</Box>;
        },
        hr() {
          return <Box sx={{ my: 3, borderTop: 1, borderColor: "divider" }} />;
        },
        code({ inline, className, children }) {
          const match = /language-(\w+)/.exec(className || "");
          const language = match?.[1];
          const code = String(children || "").replace(/\n$/, "");

          if (inline) {
            return (
              <Box
                component="code"
                sx={{
                  px: 0.6,
                  py: 0.2,
                  borderRadius: 1,
                  bgcolor: "action.hover",
                  fontSize: 13,
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                }}
              >
                {children}
              </Box>
            );
          }

          return <CodeBlock title={language ? language : "code"} code={code} />;
        },
        pre({ children }) {
          return <Box sx={{ my: 2 }}>{children}</Box>;
        },
        table({ children }) {
          return (
            <Box sx={{ overflowX: "auto", mb: 2 }}>
              <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
                {children}
              </Box>
            </Box>
          );
        },
        th({ children }) {
          return (
            <Box
              component="th"
              sx={{
                textAlign: "left",
                fontWeight: 900,
                p: 1,
                borderBottom: 1,
                borderColor: "divider",
                whiteSpace: "nowrap",
              }}
            >
              {children}
            </Box>
          );
        },
        td({ children }) {
          return (
            <Box component="td" sx={{ p: 1, borderBottom: 1, borderColor: "divider" }}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {children}
              </Typography>
            </Box>
          );
        },
        blockquote({ children }) {
          return (
            <Box
              sx={{
                borderLeft: 3,
                borderColor: "divider",
                pl: 2,
                py: 0.5,
                my: 2,
              }}
            >
              {children}
            </Box>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
