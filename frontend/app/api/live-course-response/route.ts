import { NextRequest, NextResponse } from "next/server";
import { handleInstructorLiveCourseResponse } from "@/lib/db";

export async function POST(req: NextRequest) {
    try {
        const { requestId, instructorResponse } = await req.json();

        if (!requestId || instructorResponse === undefined) {
            return NextResponse.json({ message: "Request ID and instructor response required" }, { status: 400 });
        }

        try {
            // Save instructor's response to the live course request
            await handleInstructorLiveCourseResponse(requestId, instructorResponse);

            return NextResponse.json(
                { message: "Live course response recorded successfully." },
                { status: 200 }
            );
        } catch (err: unknown) {
            if (err instanceof Error && err.message === "REQUEST_NOT_FOUND") {
                return NextResponse.json(
                    { message: "Live course request not found." },
                    { status: 404 }
                );
            }
        }

    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
    }
}