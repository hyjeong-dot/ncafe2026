import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET() {
    try {
        const session = await getSession();

        if (!session.token) {
            console.log('[BFF] Session check: No token in session');
            return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
        }

        console.log(`[BFF] Session check success for user: ${session.user?.username}, name: ${session.user?.name}`);
        return NextResponse.json({ success: true, data: session.user });
    } catch (error) {
        console.error('[BFF] Session check error:', error);
        return NextResponse.json({ success: false, message: 'Session error' }, { status: 500 });
    }
}
