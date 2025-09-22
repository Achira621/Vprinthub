'use server';

import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

const COOKIE_NAME = 'v-print-hub-session-id';

/**
 * Gets the unique session ID for the current user.
 * If a session ID doesn't exist in the cookies, it generates a new one,
 * sets it in the cookies, and returns it.
 * This function runs on the server.
 */
export async function getSessionId(): Promise<string> {
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
