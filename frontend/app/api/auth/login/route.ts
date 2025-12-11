import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/db";
import { createSessionValue, SESSION_COOKIE_NAME, SessionPayload } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: "Email and password required" }, { status: 400 });
        }

        const user = await findUserByEmail(email);

        if (!user || user.password !== password) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        // Create session cookie
        const session: SessionPayload = {
            userId: user.id,
            role: user.role,
            email: user.email,
            username: user.username,
            courseAccess: user.courseAccess,
        };

        const res = NextResponse.json(
            { message: "Login successful", user: { id: user.id, role: user.role, email: user.email, username: user.username, courseAccess: user.courseAccess } },
            { status: 200 }
        );

        // Set session cookie
        res.cookies.set(SESSION_COOKIE_NAME, createSessionValue(session), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24, // 1 gün
        });

        return res;
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}