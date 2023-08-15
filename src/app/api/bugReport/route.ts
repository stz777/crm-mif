import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: { id: number } }
) {
    const { text } = await request.json();
    const res: any = await sendMessageToTg(text, "5050441344");
    return NextResponse.json({
        success: true,
        res
    });
}

const token = process.env.TELEGRAM_BOT_TOKEN;

export async function sendMessageToTg(message: string, chat_id: string) {
    const url = `https://api.telegram.org/bot${token}/sendMessageToTg`
    return await fetch(
        url,
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            cache: "no-cache",
            body: JSON.stringify({
                chat_id: chat_id,
                text: message,
            })
        }
    )
        .then(x => x.json())
        .then(x => {
            return x;
        })
}
