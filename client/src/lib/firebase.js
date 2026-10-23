import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || "AIzaSyB-gfSRwS2QQ1eF6LRCxkk41nngom9RcG8",
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || "skillmesh-a1c5b.firebaseapp.com",
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || "skillmesh-a1c5b",
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || "skillmesh-a1c5b.firebasestorage.app",
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "689044012593",
  appId: import.meta.env?.VITE_FIREBASE_APP_ID || "1:689044012593:web:c0d29bf1540b3ae0dadf10",
  measurementId: import.meta.env?.VITE_FIREBASE_MEASUREMENT_ID || "G-ZL86R692TM"
};

// Initialize Firebase App singleton
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firebase Auth & Firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app);

// Google OAuth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Safe Analytics Initialization (avoids errors in non-browser or test environments)
export let analytics = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // Analytics unsupported or blocked
    });
}

/**
 * Sync user profile document to Cloud Firestore
 */
export const syncUserProfileToFirestore = async (uid, data) => {
  if (!uid) return null;
  try {
    const userRef = doc(db, 'users', uid);
    const payload = {
      ...data,
      updatedAt: serverTimestamp()
    };
    await setDoc(userRef, payload, { merge: true });
    return true;
  } catch (err) {
    console.warn('Note: Could not sync to Firestore (check Firestore security rules in Firebase Console):', err.message);
    return false;
  }
};

/**
 * Retrieve user profile from Cloud Firestore
 */
export const getUserProfileFromFirestore = async (uid) => {
  if (!uid) return null;
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (err) {
    console.warn('Note: Cloud Firestore fetch error:', err.message);
    return null;
  }
};

/**
 * Register with Firebase Email & Password
 */
export const firebaseRegisterUser = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

/**
 * Login with Firebase Email & Password
 */
export const firebaseLoginUser = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * 1-Click Login with Google Popup
 */
export const firebaseLoginWithGoogle = async () => {
  return signInWithPopup(auth, googleProvider);
};

/**
 * Logout from Firebase
 */
export const firebaseLogoutUser = async () => {
  return signOut(auth);
};

/**
 * Auth state listener
 */
export const onFirebaseAuthStateChanged = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Formats Firebase error codes into human-friendly error messages
 */
export const formatFirebaseError = (error) => {
  if (!error) return 'An unexpected error occurred.';
  const code = error.code || '';

  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists in Firebase. Please log in instead.';
    case 'auth/invalid-email':
      return 'The email address is invalid.';
    case 'auth/operation-not-allowed':
      return 'Email/Password or Google login is not enabled in the Firebase Console.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/user-disabled':
      return 'This user account has been disabled.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in popup was closed before completion.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by your browser. Please allow popups for this site.';
    case 'auth/unauthorized-domain':
      return 'Unauthorized Domain: The current domain is not authorized in Firebase Console. Please add it under Authentication > Settings > Authorized Domains.';
    case 'auth/network-request-failed':
      return 'Network error connecting to Firebase. Please check your internet connection.';
    default:
      return error.message || 'Authentication failed. Please try again.';
  }
};
