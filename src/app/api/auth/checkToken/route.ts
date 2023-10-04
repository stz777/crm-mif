import { NextResponse } from "next/server";
import checkTokenIsValid from "./checkTokenIsValid";

export async function POST(
    request: Request,
) {

    const requestData = await request.json();
    if (!requestData.token) {
        return new Response(null, {
            status: 401,
        });
    }

    const tokenIsValid = await checkTokenIsValid(requestData.token);

    if (tokenIsValid) {
        return NextResponse.json({
            success: true,
        });
    } else {
        return new Response(null, {
            status: 401,
        });
    }
}
