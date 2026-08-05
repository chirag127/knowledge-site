/**
 * Deterministic library call number for a concept.
 * Class letters from the OKF type; shelf number from a stable slug hash.
 * Purely presentational — a catalogue accent, not an identifier.
 */
const CLASS: Record<string, string> = {
  decision: 'DC',
  rule: 'RL',
  runbook: 'RB',
  service: 'SV',
  glossary: 'GL',
  reference: 'RF',
  index: 'IX',
  security: 'SE',
  other: 'MS',
}

function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function callNumber(type: string, slug: string): string {
  const cls = CLASS[type] ?? CLASS.other
  const n = hash(slug)
  const major = 100 + (n % 900)
  const minor = (n >> 9) % 100
  return `${cls} ${major}.${String(minor).padStart(2, '0')}`
}
