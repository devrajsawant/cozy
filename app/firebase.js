import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase app (safe to do on server)
export const firebaseApp = initializeApp(firebaseConfig);

/**
 * Returns Firebase Auth instance only on the client
 */
export function getFirebaseAuth() {
  if (typeof window === "undefined") return null; // SSR-safe
  const { getAuth } = require("firebase/auth");
  return getAuth(firebaseApp);
}
