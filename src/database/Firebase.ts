// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
const firebaseConfig = {
  apiKey: process.env.APP_API_KEY,
  authDomain: process.env.APP_AUTH_DOMAIN,
  databaseURL: process.env.APP_DATABASE_URL,
  projectId: process.env.APP_PROJECT_ID,
  storageBucket: process.env.APP_STORAGE_BUCKET,
  messagingSenderId: process.env.APP_MESSAGING_SENDER_ID,
  appId: process.env.APP_APP_ID,
  measurementId: process.env.APP_MEASUREMENT_ID,
};

export const initializeFirebaseApp = () => {
  initializeApp(firebaseConfig);
};
