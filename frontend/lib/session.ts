import { getIronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionUser {
    id: number;
    username: string;
    name: string;
    role: string;
}

export interface SessionData {
    token: string;
    user: SessionUser;
}

export const sessionOptions: SessionOptions = {
    password: process.env.SESSION_SECRET || 'ncafe2026-super-secret-session-key-32chars-minimum',
    cookieName: 'ncafe_session',
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 60 * 60 * 24, // 24 hours
    },
};

export async function getSession() {
    const cookieStore = await cookies();
    return getIronSession<SessionData>(cookieStore, sessionOptions);
}
