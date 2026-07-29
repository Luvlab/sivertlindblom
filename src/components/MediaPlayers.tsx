export interface MediaItem { label: string; url: string }

function isVideo(url: string): boolean {
  return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url)
}

/** Render a list of uploaded audio/video files as inline players, in order. */
export default function MediaPlayers({ media }: { media?: MediaItem[] }) {
  if (!media || media.length === 0) return null
  return (
    <div style={{ marginTop: '2rem', marginBottom: '3rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {media.map((m, i) => (
        <div key={i}>
          {m.label && (
            <p style={{ fontSize: 'var(--fs-xs)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.5rem' }}>{m.label}</p>
          )}
          {isVideo(m.url) ? (
            <div style={{ width: '100%', maxWidth: 720, aspectRatio: '16/9', background: '#000', borderRadius: 4, overflow: 'hidden' }}>
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video controls preload="metadata" src={m.url} style={{ width: '100%', height: '100%', display: 'block' }} />
            </div>
          ) : (
            /* eslint-disable-next-line jsx-a11y/media-has-caption */
            <audio controls preload="none" src={m.url} style={{ width: '100%', maxWidth: 480, height: 40, accentColor: 'var(--color-accent)' }} />
          )}
        </div>
      ))}
    </div>
  )
}
