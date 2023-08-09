import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: { id: number } }
) {
    const data = await request.json();
    return NextResponse.json({
        success: true,
        data,
        params
    });
}