import admin from 'firebase-admin';

if (!admin.apps.length) {
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
}

const auth = admin.auth();
const db = admin.firestore();

export { auth, db };
