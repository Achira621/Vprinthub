// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// --- HOW TO CONFIGURE FIREBASE ---
// 1. Go to https://console.firebase.google.com/ and create a new project.
// 2. In your project, go to Project Settings (click the gear icon).
// 3. Under the "General" tab, scroll down to "Your apps".
// 4. Click the web icon (</>) to add a new web app.
// 5. Firebase will give you a `firebaseConfig` object. Copy the values into the `.env` file in the root of this project.
//    - You will find a list of all the environment variables you need to set in the `.env` file.
// 6. In the Firebase Console, go to "Build" > "Firestore Database" and create a database.
//    - Start in "test mode" for now. This allows your app to read and write freely.
//    - For production, you will need to set up proper security rules.

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
// To prevent re-initialization on hot reloads, we check if an app is already initialized.
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// After configuring your .env file and restarting the server, 
// your app will be connected to your live database. When you create a print job or book a slot,
// you will see the data appear in the Firestore Database section of the Firebase Console.
