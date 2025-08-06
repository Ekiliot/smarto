import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut, onAuthStateChanged, User as FirebaseUser, getRedirectResult } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

// Initialize Analytics (only in browser)
let analytics = null
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app)
  } catch (error) {
    console.warn('Analytics not available:', error)
  }
}

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

// Check if device is mobile
const isMobile = () => {
  if (typeof window === 'undefined') return false
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}

// Firebase auth functions
export const signInWithGoogle = async () => {
  try {
    // Use redirect for mobile devices, popup for desktop
    if (isMobile()) {
      console.log('Using redirect for mobile device')
      await signInWithRedirect(auth, googleProvider)
    } else {
      console.log('Using popup for desktop device')
      const result = await signInWithPopup(auth, googleProvider)
      return result
    }
  } catch (error) {
    console.error('Firebase Google sign in error:', error)
    throw error
  }
}

// Handle redirect result
export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth)
    if (result) {
      console.log('Redirect result:', result.user.email)
      return result
    }
  } catch (error) {
    console.error('Error handling redirect result:', error)
    throw error
  }
}

export const signOutFromFirebase = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error('Firebase sign out error:', error)
    throw error
  }
}

// Get current Firebase user
export const getCurrentFirebaseUser = (): FirebaseUser | null => {
  return auth.currentUser
}

// Listen to auth state changes
export const onFirebaseAuthStateChanged = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback)
}

export { analytics }
export default app 