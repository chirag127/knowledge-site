import { useEffect, useState } from 'react'
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/clerk-react'

const pk = import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY as string | undefined

/**
 * Header account control. Public content is NEVER gated — this only offers
 * an optional sign-in so a reader can keep a personal shelf. Cross-subdomain
 * SSO across *.oriz.in is Clerk's default.
 */
export default function AccountControl() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!pk || !mounted) return null
  return (
    <ClerkProvider publishableKey={pk} afterSignOutUrl="/">
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
    </ClerkProvider>
  )
}
