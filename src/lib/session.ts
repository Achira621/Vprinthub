'use server';

import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

const COOKIE_NAME = 'v-print-hub-session-id';

/**
 * Gets the unique session ID for the current user from cookies.
 * This is a read-only function, safe to use in Server Components.
 * @returns The session ID string or null if not found.
 */
export async function getSessionId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value || null;
}

/**
 * A Server Action to create a session cookie if one doesn't exist.
 * This should be called from the client-side (e.g., in a useEffect).
 * @returns The session ID (either existing or newly created).
 */
export async function createSession(): Promise<string> {
  'use server';

  const cookieStore = await cookies();
  let sessionId = cookieStore.get(COOKIE_NAME)?.value;

  if (!sessionId) {
    sessionId = uuidv4();
    cookieStore.set(COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // One week
      path: '/',
    });
  }

  return sessionId;
}
