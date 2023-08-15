import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: { id: number } }
) {
    return NextResponse.json({
        success: true,
    });
}