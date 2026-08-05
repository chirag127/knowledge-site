import { useEffect, useState } from 'react'
import { ClerkProvider, SignedIn, SignedOut, useAuth } from '@clerk/clerk-react'
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore'
import { getDb } from '../lib/firebase'

const pk = import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY as string | undefined

interface Props {
  slug: string
  callNumber: string
}

/**
 * "File on my shelf" — the one Clerk-gated feature. The concept itself is fully
 * public; this only lets a signed-in reader bookmark it into Firestore, keyed by
 * their Clerk user id. Signed-out readers see a prompt, never a wall.
 */
function ShelfInner({ slug, callNumber }: Props) {
  const { userId, isLoaded } = useAuth()
  const [filed, setFiled] = useState<boolean | null>(null)
  const [busy, setBusy] = useState(false)
  const db = getDb()

  useEffect(() => {
    if (!isLoaded || !userId || !db) return
    getDoc(doc(db, 'users', userId, 'shelf', encodeKey(slug)))
      .then((s) => setFiled(s.exists()))
      .catch(() => setFiled(false))
  }, [isLoaded, userId, db, slug])

  if (!userId || !db) return null

  async function toggle() {
    if (!db || !userId || busy) return
    setBusy(true)
    const ref = doc(db, 'users', userId, 'shelf', encodeKey(slug))
    try {
      if (filed) {
        await deleteDoc(ref)
        setFiled(false)
      } else {
        await setDoc(ref, { slug, callNumber, filedAt: Date.now() })
        setFiled(true)
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <button className="tool-btn" type="button" onClick={toggle} disabled={busy} aria-pressed={filed ?? false}>
      {filed ? 'Filed ✓' : 'File on shelf'}
    </button>
  )
}

function encodeKey(slug: string) {
  return slug.replace(/\//g, '__')
}

export default function ShelfButton(props: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!pk || !mounted) return null
  return (
    <ClerkProvider publishableKey={pk} afterSignOutUrl="/">
      <SignedIn>
        <ShelfInner {...props} />
      </SignedIn>
      <SignedOut>
        <span className="tool-btn" style={{ opacity: 0.65 }} title="Sign in to keep a personal shelf">
          Sign in to file
        </span>
      </SignedOut>
    </ClerkProvider>
  )
}
