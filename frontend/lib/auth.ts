import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "girisimci_turk_session";

// Session payload structure
export type SessionPayload = {
    email: string;
    userId: string;
    role: "user" | "instructor" | "admin";
    username: string;
    courseAccess: string[];
};

// Create a session cookie value from session payload
export function createSessionValue(payload: SessionPayload): string {
    return JSON.stringify(payload);
}

// Parse session cookie value into session payload
export function parseSessionValue(value: string | undefined): SessionPayload | null {
    if (!value) return null;
    try {
        return JSON.parse(value) as SessionPayload;
    } catch {
        return null;
    }
}

// Get session payload from session cookie
export async function getSession(): Promise<SessionPayload | null> {
    const cookieStore = await cookies();
    const value = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    return parseSessionValue(value);
}

// Clear the session cookie
export async function clearSessionCookie() {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });
}