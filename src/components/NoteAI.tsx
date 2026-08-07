import { useCallback, useRef, useState } from 'react'
import { chat, complete } from '@chirag127/oz-ai'

interface Props {
  /** Card title, for prompt framing. */
  title: string
  /** Raw markdown body of the card — the note text the AI reads. */
  body: string
}

type Mode = 'summary' | 'ask'

const MAX_CTX = 8000 // keep the prompt light; cards are short but cap anyway

/**
 * Optional AI helper on a concept card: summarize the note, or ask a question
 * answered strictly from the note. Keyless via oz-ai (g4f failover). If every
 * provider fails the panel shows a quiet notice and never blocks the reader —
 * the card content above is the source of truth.
 */
export default function NoteAI({ title, body }: Props) {
  const note = body.slice(0, MAX_CTX)
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<Mode>('summary')
  const [question, setQuestion] = useState('')
  const [out, setOut] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const abortRef = useRef<AbortController | null>(null)

  const run = useCallback(
    async (m: Mode) => {
      if (busy) return
      if (m === 'ask' && !question.trim()) return
      setMode(m)
      setErr('')
      setOut('')
      setBusy(true)
      const ac = new AbortController()
      abortRef.current = ac
      let acc = ''
      try {
        const system =
          'You are a concise reference librarian. Answer ONLY from the supplied card text. ' +
          'If the card does not cover it, say so plainly. Terse. No preamble.'
        const prompt =
          m === 'summary'
            ? `Summarize this card in 3-4 tight sentences for a busy reader.\n\nCARD "${title}":\n${note}`
            : `CARD "${title}":\n${note}\n\nQUESTION: ${question.trim()}`
        const stream = await chat([{ role: 'user', content: prompt }], {
          system,
          stream: true,
          signal: ac.signal,
        })
        for await (const delta of stream) {
          acc += delta
          setOut(acc)
        }
        if (!acc.trim()) throw new Error('empty')
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        if (msg !== 'aborted') setErr('AI helpers are busy. The card above is complete on its own — try again shortly.')
      } finally {
        setBusy(false)
        abortRef.current = null
      }
    },
    [busy, note, question, title],
  )

  const stop = useCallback(() => abortRef.current?.abort(), [])

  if (!open) {
    return (
      <button className="tool-btn" type="button" onClick={() => { setOpen(true); void run('summary') }}>
        Ask the card ✦
      </button>
    )
  }

  return (
    <div
      style={{
        border: '1px solid var(--rule)',
        borderRadius: '4px',
        background: 'color-mix(in srgb, var(--card) 92%, transparent)',
        padding: '0.9rem 1rem 1rem',
        marginBottom: '1.5rem',
        width: '100%',
        fontFamily: 'var(--font-body)',
      }}
    >
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.7rem', flexWrap: 'wrap' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            letterSpacing: 'var(--tab)',
            textTransform: 'uppercase',
            color: 'var(--muted)',
          }}
        >
          Reference desk
        </span>
        <button className="tool-btn" type="button" onClick={() => run('summary')} disabled={busy}>
          Summarize
        </button>
        {busy ? (
          <button className="tool-btn" type="button" onClick={stop}>Stop</button>
        ) : null}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); void run('ask') }}
        style={{ display: 'flex', gap: '0.5rem', marginBottom: out || err || busy ? '0.8rem' : 0 }}
      >
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about this card…"
          aria-label="Ask about this card"
          style={{
            flex: 1,
            background: 'var(--code-bg)',
            border: '1px solid var(--rule)',
            borderRadius: '3px',
            color: 'var(--fg)',
            font: 'inherit',
            fontSize: '0.9rem',
            padding: '0.4rem 0.6rem',
          }}
        />
        <button className="tool-btn" type="submit" disabled={busy || !question.trim()}>Ask</button>
      </form>

      {busy && !out ? (
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: 0 }}>
          {mode === 'summary' ? 'Reading the card…' : 'Consulting the card…'}
        </p>
      ) : null}

      {out ? (
        <div
          style={{
            fontSize: '0.92rem',
            lineHeight: 1.6,
            color: 'var(--fg)',
            whiteSpace: 'pre-wrap',
          }}
        >
          {out}
        </div>
      ) : null}

      {err ? (
        <p style={{ color: 'var(--stamp)', fontSize: '0.85rem', margin: 0 }}>{err}</p>
      ) : null}
    </div>
  )
}
