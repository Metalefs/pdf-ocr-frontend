---
title: "PDF.js Renders Garbled Characters? Why OCR Often Beats Parsing for Broken Encodings"
slug: pdfjs-encoding-problem-ocr-solution
date: 2026-01-15
author: TextLayer Team
category: Technical Deep Dive
tags: [pdf.js, ocr, encoding, troubleshooting]
excerpt: "A technical explanation of why PDF.js can display corrupted characters and why OCR can be a safer fallback when the source text encoding is unreliable."
featured: true
readTime: 8
seo:
  description: "Understand why PDF.js can render corrupted characters and how OCR can rebuild a clean text layer when fonts/CMaps/encodings are unreliable."
  keywords: "pdf.js encoding error, pdf garbled text, corrupted pdf text, ocr vs parsing"
---

# PDF.js Renders Garbled Characters? Why OCR Often Beats Parsing for Broken Encodings

You open a PDF in a native viewer and everything looks fine  but in PDF.js the text becomes unreadable (`�����`) or mapped to the wrong characters.

This is a known class of problems when PDFs rely on **non-standard encodings**, missing/incorrect **CMaps**, or custom embedded fonts.

## The root cause: parsing depends on the original encoding

PDF.js is fundamentally a parser/renderer. If the PDF’s text layer is encoded in a way PDF.js can’t map correctly (or it can’t find the right mapping tables), it may show incorrect characters even though a desktop viewer can “figure it out”.

Example (simplified):

```js
import * as pdfjs from 'pdfjs-dist';

const pdf = await pdfjs.getDocument({
  data: fileBuffer,
  cMapUrl: '/cmaps/',
  cMapPacked: true,
}).promise;

// If fonts/CMaps/encoding are non-standard or missing,
// extracted text may be wrong or unreadable.
```

Common triggers:

- legacy producers using MacRoman / ISO-8859-* style encodings
- custom embedded fonts without robust Unicode mapping
- missing or incompatible ToUnicode maps / CMaps

## The OCR approach: ignore the broken text layer and rebuild

OCR doesn’t “decode” the existing text layer.
Instead, it works from what is visually on the page:

1. Render each page to an image (no dependency on font encoding)
2. Run OCR to obtain text as Unicode (UTF-8)
3. Write a new *searchable text layer* back into the PDF

Conceptually:

```text
PDF bytes
  -> render pages as images
  -> OCR images into text
  -> write text layer into PDF (search/select/copy)
```

### Why this helps

- You avoid relying on the original encoding entirely
- You get consistent Unicode output
- It works even when the source PDF has a “visually correct, semantically broken” text layer

## Parsing vs OCR: when to use each

Use PDF.js parsing when:

- the PDF is born-digital (Word → PDF)
- the text layer is already correct Unicode
- you need structural details from the PDF content stream

Use OCR when:

- the PDF is scanned (image-only)
- text extraction is unreliable due to encoding/font mapping issues
- you care more about searchability than perfect structural fidelity

## Practical recommendation

For production systems, a solid strategy is:

- Try parsing/extraction first (fast)
- Detect corruption/low confidence
- Fall back to OCR for the problematic documents

## References

- PDF.js Issue #9692: https://github.com/mozilla/pdf.js/issues/9692
- Tesseract OCR: https://github.com/tesseract-ocr/tesseract

---

Previous post: [How to Add a Searchable Text Layer to Scanned PDFs →](/en/blog/adicionar-camada-texto-pdf-escaneado)

Tags: #OCR #PDFjs #Encoding
