import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET() {
    const session = await getSession();

    if (!session.token) {
        return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    return NextResponse.json({ success: true, data: session.user });
}
