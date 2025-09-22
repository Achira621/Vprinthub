import admin from 'firebase-admin';

// Check if all necessary environment variables are present
const hasAllCredentials =
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_PRIVATE_KEY &&
  process.env.FIREBASE_CLIENT_EMAIL;

if (!admin.apps.length) {
  if (hasAllCredentials) {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };

    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as any),
      });
    } catch (error: any) {
      console.error('Firebase Admin initialization error:', error.message);
      // Throw a more descriptive error or handle it as needed
      throw new Error(`Failed to initialize Firebase Admin SDK. Please check your service account credentials in the environment variables. Original error: ${error.message}`);
    }
  } else {
    console.warn(
      'Firebase Admin SDK credentials are not fully configured in your .env file. The Admin SDK has not been initialized. Some server-side Firebase features will not be available.'
    );
  }
}

// Only export auth and db if they have been initialized
const auth = admin.apps.length > 0 ? admin.auth() : null;
const db = admin.apps.length > 0 ? admin.firestore() : null;

// Throw an error if someone tries to use a non-initialized service
function getAuth() {
    if (!auth) {
        throw new Error('Firebase Auth has not been initialized. Please check your server-side environment variables.');
    }
    return auth;
}

function getDb() {
    if (!db) {
        throw new Error('Firestore has not been initialized. Please check your server-side environment variables.');
    }
    return db;
}


export { getAuth as auth, getDb as db };
