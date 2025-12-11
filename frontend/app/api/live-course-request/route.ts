import { NextRequest, NextResponse } from "next/server";
import { liveCourseRequestHandler } from "@/lib/db";

export async function POST(req: NextRequest) {
    try {
        // Get userId from session cookie
        const cookies = req.cookies.get('girisimci_turk_session');
        if (!cookies?.value) {
            return NextResponse.json({ message: "Session cookie not found" }, { status: 401 });
        }
        const userId = JSON.parse(cookies.value).userId;
        const { fieldName, topicName } = await req.json();

        if (!fieldName || !topicName) {
            return NextResponse.json({ message: "Field name and topic name required" }, { status: 400 });
        }

        try {
            // Create live course request
            const response = await liveCourseRequestHandler(fieldName, topicName, userId);

            return NextResponse.json(
                { message: "Live course request successful", instructor: response.matchedInstructor },
                { status: 200 }
            );
        } catch (err: unknown) {
            if (err instanceof Error && err.message === "NO_INSTRUCTORS_AVAILABLE") {
                return NextResponse.json(
                    { message: "No available instructors found for the requested field or topic." },
                    { status: 404 }
                );
            }
        }

    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
    }
}