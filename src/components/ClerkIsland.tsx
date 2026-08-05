import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useAuth,
} from '@clerk/clerk-react'
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore'
import { getDb } from '../lib/firebase'

const pk = import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY as string | undefined

interface Shelf {
  slug: string
  callNumber: string
}

interface Props {
  /** Present only on concept pages — enables the Firestore "shelf" feature. */
  shelf?: Shelf
}

function AccountControl() {
  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <button className="tool-btn" type="button">Shelf</button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton
          appearance={{ elements: { avatarBox: { width: 26, height: 26 } } }}
        />
      </SignedIn>
    </>
  )
}

function encodeKey(slug: string) {
  return slug.replace(/\//g, '__')
}

function ShelfInner({ slug, callNumber }: Shelf) {
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

function ShelfButton(shelf: Shelf) {
  return (
    <>
      <SignedIn>
        <ShelfInner {...shelf} />
      </SignedIn>
      <SignedOut>
        <span className="tool-btn" style={{ opacity: 0.65 }} title="Sign in to keep a personal shelf">
          Sign in to file
        </span>
      </SignedOut>
    </>
  )
}

/**
 * The single Clerk root for the whole page. Both the header account control and
 * the (optional) concept-page shelf button live under ONE <ClerkProvider>. The
 * shelf UI is portalled into the #shelf-slot placeholder that concept pages
 * render, so a page never mounts a second provider. Public content is never
 * gated — Clerk only offers an optional personal shelf.
 */
export default function ClerkIsland({ shelf }: Props) {
  const [mounted, setMounted] = useState(false)
  const [slot, setSlot] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setMounted(true)
    if (shelf) setSlot(document.getElementById('shelf-slot'))
  }, [shelf])

  if (!pk || !mounted) return null

  return (
    <ClerkProvider publishableKey={pk} afterSignOutUrl="/">
      <AccountControl />
      {shelf && slot ? createPortal(<ShelfButton {...shelf} />, slot) : null}
    </ClerkProvider>
  )
}
