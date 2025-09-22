'use server';

import { cookies } from 'next/headers';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { auth } from './firebase-admin';

const SESSION_COOKIE_NAME = 'v-print-hub-session';

/**
 * Creates a session cookie for the given user ID token.
 */
export async function createSessionCookie(idToken: string) {
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
    cookies().set(SESSION_COOKIE_NAME, sessionCookie, {
        maxAge: expiresIn,
        httpOnly: true,
        secure: true,
    });
}

/**
 * Revokes the session cookie, effectively logging the user out.
 */
export async function revokeSessionCookie() {
    cookies().delete(SESSION_COOKIE_NAME);
}

/**
 * Verifies the session cookie and returns the decoded token if valid.
 * This is used in server-side logic to get the authenticated user.
 */
export async function getSession(): Promise<DecodedIdToken | null> {
    const sessionCookie = cookies().get(SESSION_COOKIE_NAME)?.value;
    if (!sessionCookie) {
        return null;
    }
    try {
        const decodedIdToken = await auth.verifySessionCookie(sessionCookie, true);
        return decodedIdToken;
    } catch (error) {
        console.error('Error verifying session cookie:', error);
        return null;
    }
}
