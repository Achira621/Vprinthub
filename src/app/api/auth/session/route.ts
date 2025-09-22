import { createSessionCookie, revokeSessionCookie } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const idToken = authHeader.split('Bearer ')[1];
  
  try {
    await createSessionCookie(idToken);
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Failed to create session cookie:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await revokeSessionCookie();
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Failed to revoke session cookie:', error);
    return NextResponse.json({ error: 'Failed to clear session' }, { status: 500 });
  }
}
