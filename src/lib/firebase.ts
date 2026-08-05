import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'

const cfg = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
}

export const firebaseReady = Boolean(cfg.apiKey && cfg.projectId)

let app: FirebaseApp | null = null
let db: Firestore | null = null

/** Firestore only — Clerk owns auth. Returns null when env unset (public build). */
export function getDb(): Firestore | null {
  if (!firebaseReady) return null
  if (!app) app = getApps()[0] ?? initializeApp(cfg)
  if (!db) db = getFirestore(app)
  return db
}
