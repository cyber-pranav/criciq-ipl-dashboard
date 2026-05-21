// src/services/firebase.js
// Firebase initialization for CricIQ dashboard
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

const isConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let app = null;
let db = null;
let auth = null;

if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.log('[CricIQ] Firebase initialized successfully');
  } catch (error) {
    console.warn('[CricIQ] Firebase initialization failed:', error.message);
    console.info('[CricIQ] Running in demo mode — no backend persistence');
  }
} else {
  console.info(
    '[CricIQ] Firebase env vars not set — running in demo mode. ' +
    'Set VITE_FIREBASE_* env variables to enable backend.'
  );
}

/**
 * Signs in anonymously so Firestore security rules can gate access.
 * In demo mode (no Firebase config) this resolves with null.
 */
export async function initAuth() {
  if (!auth) {
    console.info('[CricIQ] Auth skipped — demo mode');
    return null;
  }

  try {
    const credential = await signInAnonymously(auth);
    console.log('[CricIQ] Anonymous auth succeeded, uid:', credential.user.uid);
    return credential.user;
  } catch (error) {
    console.error('[CricIQ] Anonymous auth failed:', error.message);
    return null;
  }
}

export { app, db, auth };
