import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function POST() {
    const session = await getSession();
    session.destroy();

    const response = NextResponse.json({ success: true, message: 'Logged out' });

    // Also clear the 'token' cookie if it was set by Spring previously
    response.cookies.delete('token');

    return response;
}
