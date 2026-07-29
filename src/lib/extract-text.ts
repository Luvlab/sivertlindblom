'use client'

// Pull plain text out of the document types people actually upload — plain text,
// Markdown/CSV, RTF, Word (.docx) and PDF — with charset detection so Swedish
// å ä ö survive files that were saved as Windows-1252 / Latin-1 rather than UTF-8.

const PDFJS_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
const PDFJS_WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'

/** File extensions the picker should accept and this module knows how to read. */
export const ACCEPTED_DOC_TYPES =
  '.txt,.text,.md,.markdown,.csv,.tsv,.log,.rtf,.pdf,.docx,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document'

/** Decode bytes as UTF-8, falling back to Windows-1252 when they aren't valid
 *  UTF-8 (typical for Swedish text from Windows/older editors — otherwise the
 *  bytes for å ä ö turn into mojibake like Ã¥ Ã¤ Ã¶). Strips a UTF-8 BOM. */
export function decodeText(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf)
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes).replace(/^﻿/, '')
  } catch {
    // Not valid UTF-8 → assume legacy Windows-1252 (superset of ISO-8859-1).
    return new TextDecoder('windows-1252').decode(bytes)
  }
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16)))
}

/** Best-effort RTF → plain text: unescape hex/unicode, keep paragraph breaks,
 *  drop control words and groups. Good enough to feed an LLM. */
function stripRtf(rtf: string): string {
  let s = rtf
  s = s.replace(/\\u(-?\d+)\s?\??/g, (_, n) => {
    let code = parseInt(n, 10); if (code < 0) code += 65536; return String.fromCharCode(code)
  })
  s = s.replace(/\\'([0-9a-fA-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16))) // 1252/latin1 byte
  s = s.replace(/\\par[d]?\b|\\line\b/g, '\n')
  s = s.replace(/\\[a-zA-Z]+-?\d* ?/g, '') // control words (+ optional trailing space)
  s = s.replace(/[{}]/g, '').replace(/\\\*/g, '').replace(/\\[^a-zA-Z]/g, '')
  return s.replace(/\r/g, '').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
}

async function inflateRaw(data: Uint8Array): Promise<Uint8Array> {
  const DS = (globalThis as unknown as { DecompressionStream?: typeof DecompressionStream }).DecompressionStream
  if (!DS) throw new Error('Din webbläsare kan inte packa upp .docx (uppdatera webbläsaren).')
  const stream = new Blob([data as BlobPart]).stream().pipeThrough(new DS('deflate-raw'))
  return new Uint8Array(await new Response(stream).arrayBuffer())
}

/** Read word/document.xml out of a .docx (a ZIP) via the central directory, then
 *  turn the WordprocessingML into text (paragraphs → newlines). */
async function extractDocx(buf: ArrayBuffer): Promise<string> {
  const bytes = new Uint8Array(buf)
  const dv = new DataView(buf)
  const u16 = (o: number) => dv.getUint16(o, true)
  const u32 = (o: number) => dv.getUint32(o, true)

  let eocd = -1
  for (let i = bytes.length - 22; i >= 0 && i > bytes.length - 22 - 65536; i--) {
    if (u32(i) === 0x06054b50) { eocd = i; break }
  }
  if (eocd < 0) throw new Error('Ogiltig .docx-fil.')

  const cdCount = u16(eocd + 10)
  let p = u32(eocd + 16)
  let lho = -1, method = 0, compSize = 0
  for (let n = 0; n < cdCount && u32(p) === 0x02014b50; n++) {
    const fnLen = u16(p + 28), exLen = u16(p + 30), cmLen = u16(p + 32)
    const name = new TextDecoder().decode(bytes.subarray(p + 46, p + 46 + fnLen))
    if (name === 'word/document.xml') { method = u16(p + 10); compSize = u32(p + 20); lho = u32(p + 42); break }
    p += 46 + fnLen + exLen + cmLen
  }
  if (lho < 0) throw new Error('Hittade ingen text i dokumentet.')

  const dataStart = lho + 30 + u16(lho + 26) + u16(lho + 28)
  const comp = bytes.subarray(dataStart, dataStart + compSize)
  const raw = method === 0 ? comp : await inflateRaw(comp)
  const xml = new TextDecoder('utf-8').decode(raw)
  return decodeEntities(
    xml
      .replace(/<w:tab\b[^>]*\/>/g, '\t')
      .replace(/<\/w:p>/g, '\n')
      .replace(/<w:br\b[^>]*\/?>/g, '\n')
      .replace(/<[^>]+>/g, ''),
  ).replace(/\n{3,}/g, '\n\n').trim()
}

let pdfjs: Promise<Record<string, unknown>> | null = null
function loadPdfjs(): Promise<Record<string, unknown>> {
  const w = window as unknown as { pdfjsLib?: Record<string, unknown>; __pdfWorkerBlob?: string }
  if (w.pdfjsLib) return Promise.resolve(w.pdfjsLib)
  if (!pdfjs) {
    pdfjs = new Promise((resolve, reject) => {
      const s = document.createElement('script')
      s.src = PDFJS_SRC
      s.onload = async () => {
        try {
          const lib = w.pdfjsLib!
          if (!w.__pdfWorkerBlob) {
            const wjs = await fetch(PDFJS_WORKER).then((r) => r.text())
            w.__pdfWorkerBlob = URL.createObjectURL(new Blob([wjs], { type: 'text/javascript' }))
          }
          ;(lib.GlobalWorkerOptions as { workerSrc: string }).workerSrc = w.__pdfWorkerBlob
          resolve(lib)
        } catch (e) { reject(e) }
      }
      s.onerror = () => reject(new Error('Kunde inte ladda PDF-läsaren.'))
      document.head.appendChild(s)
    })
  }
  return pdfjs
}

async function extractPdf(buf: ArrayBuffer): Promise<string> {
  const lib = await loadPdfjs()
  const getDocument = lib.getDocument as (src: { data: ArrayBuffer }) => { promise: Promise<{ numPages: number; getPage(n: number): Promise<{ getTextContent(): Promise<{ items: Array<{ str?: string }> }> }> }> }
  const pdf = await getDocument({ data: buf }).promise
  const pages: string[] = []
  for (let i = 1; i <= pdf.numPages; i++) {
    const content = await (await pdf.getPage(i)).getTextContent()
    pages.push(content.items.map((it) => it.str ?? '').join(' '))
  }
  return pages.join('\n\n').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim()
}

/** Extract readable text from an uploaded document, choosing the reader by extension. */
export async function extractTextFromFile(file: File): Promise<string> {
  const name = file.name.toLowerCase()
  const buf = await file.arrayBuffer()
  if (name.endsWith('.pdf')) return extractPdf(buf)
  if (name.endsWith('.docx')) return extractDocx(buf)
  if (name.endsWith('.rtf')) return stripRtf(decodeText(buf))
  if (name.endsWith('.doc')) throw new Error('Gamla .doc stöds inte — spara om som .docx, .pdf eller .txt.')
  return decodeText(buf) // txt, md, csv, tsv, log, and other plain text
}
