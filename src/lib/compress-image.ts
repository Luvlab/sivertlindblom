// Client-side image downscaling/compression.
//
// Phone photos are often 5–12 MB, which exceeds the serverless function body
// limit (~4.5 MB on Vercel). When that limit is hit the upload endpoint returns
// a non-JSON error, which used to surface to the user as a cryptic "syntax
// error". Downscaling in the browser before upload keeps files well under the
// limit and makes uploads reliable.

interface CompressOptions {
  /** Longest-edge cap in px. Default 2400. */
  maxDim?: number
  /** JPEG quality 0–1. Default 0.85. */
  quality?: number
  /** Target ceiling in bytes; a second, harder pass runs if exceeded. Default 4 MB. */
  maxBytes?: number
}

const DEFAULTS: Required<CompressOptions> = {
  maxDim: 2400,
  quality: 0.85,
  maxBytes: 4 * 1024 * 1024,
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
}

async function render(bitmap: ImageBitmap, maxDim: number, quality: number): Promise<Blob | null> {
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height))
  const w = Math.max(1, Math.round(bitmap.width * scale))
  const h = Math.max(1, Math.round(bitmap.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  ctx.drawImage(bitmap, 0, 0, w, h)
  return canvasToBlob(canvas, quality)
}

/**
 * Downscale/re-encode an image File to a JPEG that fits under `maxBytes`.
 * Returns the original File unchanged for non-raster types (SVG/GIF) or if the
 * browser can't decode it (e.g. some HEIC) — the server still attempts those.
 */
export async function compressImageFile(file: File, opts: CompressOptions = {}): Promise<File> {
  const { maxDim, quality, maxBytes } = { ...DEFAULTS, ...opts }

  // Only touch raster images the canvas can re-encode meaningfully.
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file
  }
  if (typeof createImageBitmap !== 'function' || typeof document === 'undefined') {
    return file
  }

  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    return file // undecodable (e.g. HEIC on some browsers) — let the server try
  }

  try {
    // Already small in both dimensions and bytes → keep as-is.
    if (Math.max(bitmap.width, bitmap.height) <= maxDim && file.size <= maxBytes) {
      return file
    }

    let blob = await render(bitmap, maxDim, quality)
    // Harder second pass if still over the ceiling.
    if (blob && blob.size > maxBytes) {
      const harder = await render(bitmap, Math.min(maxDim, 1800), 0.7)
      if (harder) blob = harder
    }
    if (!blob) return file

    const baseName = file.name.replace(/\.[^.]+$/, '') || 'image'
    return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' })
  } finally {
    bitmap.close?.()
  }
}
