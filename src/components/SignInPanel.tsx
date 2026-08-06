import { ClerkProvider, SignIn } from '@clerk/clerk-react'

const pk = import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY as string | undefined

// Card-catalogue theme — brass on spruce, index-card paper.
const appearance = {
  variables: {
    colorPrimary: '#c59f5f',
    colorBackground: '#1b2620',
    colorText: '#ece3cd',
    colorTextSecondary: '#8b9384',
    colorInputBackground: '#141d18',
    colorInputText: '#ece3cd',
    borderRadius: '4px',
    fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
  },
  elements: {
    card: { backgroundColor: '#1b2620', border: '1px solid rgba(139,147,132,0.22)' },
    headerTitle: { fontFamily: "'Fraunces', Georgia, serif", color: '#ece3cd' },
    formButtonPrimary: { backgroundColor: '#c59f5f', color: '#141d18', textTransform: 'none' as const },
    footerActionLink: { color: '#c59f5f' },
  },
} as const

export default function SignInPanel() {
  if (!pk) return <p className="signin-missing">Sign-in is not configured on this build.</p>
  return (
    <ClerkProvider publishableKey={pk} afterSignOutUrl="/" appearance={appearance}>
      <SignIn routing="hash" appearance={appearance} />
    </ClerkProvider>
  )
}
