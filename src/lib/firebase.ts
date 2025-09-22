// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// --- HOW TO CONFIGURE FIREBASE ---
// 1. Go to https://console.firebase.google.com/ and create a new project.
// 2. In your project, go to Project Settings (click the gear icon).
// 3. Under the "General" tab, scroll down to "Your apps".
// 4. Click the web icon (</>) to add a new web app.
// 5. Firebase will give you a `firebaseConfig` object. Copy it here to replace the placeholder below.
// 6. In the Firebase Console, go to "Build" > "Firestore Database" and create a database.
//    - Start in "test mode" for now. This allows your app to read and write freely.
//    - For production, you will need to set up security rules.

// Your web app's Firebase configuration (REPLACE WITH YOURS)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// After configuring this, run your app. When you create a print job or book a slot,
// you will see the data appear in the Firestore Database section of the Firebase Console.
