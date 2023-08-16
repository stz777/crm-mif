import { NextResponse } from "next/server";
import { sendMessageToTg } from "./sendMessageToTg";

export async function POST(
    request: Request,
    { params }: { params: { id: number } }
) {
    const { text } = await request.json();
    const res: any = await sendMessageToTg(JSON.stringify(text, null, 2), "5050441344");
    console.log('text', text);

    return NextResponse.json({
        success: true,
        res
    });
}
