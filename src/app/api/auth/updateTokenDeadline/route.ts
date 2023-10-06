import { NextResponse } from "next/server";
import updateTokenDeadline from "./updateTokenDeadline";
import deleteUnusedTokens from "./deleteUnusedTokens";

export async function POST(
    request: Request,
) {
    const requestData = await request.json();
    const updated = await updateTokenDeadline(requestData.token);
    await deleteUnusedTokens();
    if (updated) {
        return NextResponse.json({
            success: true,
        });
    } else {
        return NextResponse.json({
            success: false,
        });
    }
}