import { NextResponse } from 'next/server';
import { MOCK_USER } from '@/lib/mockData';

// Temporary endpoint standing in for the real session lookup.
// Remove once the backend auth/session route exists.
export async function GET() {
  return NextResponse.json({ user: MOCK_USER });
}
