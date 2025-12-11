import { NextRequest, NextResponse } from "next/server";
import { signup } from "@/lib/db";
import {
    createSessionValue,
    SESSION_COOKIE_NAME,
    SessionPayload,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const { email, username, password } = await req.json();

        if (!email || !username || !password) {
            return NextResponse.json(
                { message: "Email, username and password are required" },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { message: "Password must be at least 8 characters" },
                { status: 400 }
            );
        }

        let newUser;
        try {
            newUser = await signup({ email, username, password });
        } catch (err: unknown) {
            if (err instanceof Error && err.message === "EMAIL_TAKEN") {
                return NextResponse.json(
                    { message: "Email is already in use" },
                    { status: 409 }
                );
            }
            console.error(err);
            return NextResponse.json(
                { message: "Could not create user" },
                { status: 500 }
            );
        }

        // Create session cookie
        const session: SessionPayload = {
            userId: newUser.id,
            email: newUser.email,
            username: newUser.username,
            role: newUser.role,
            courseAccess: newUser.courseAccess,
        };

        const res = NextResponse.json(
            {
                message: "Signup successful",
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    username: newUser.username,
                    role: newUser.role,
                    courseAccess: newUser.courseAccess,
                },
            },
            { status: 201 }
        );

        // Set session cookie
        res.cookies.set(SESSION_COOKIE_NAME, createSessionValue(session), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24,
        });

        return res;
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}
