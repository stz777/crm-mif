import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";

export async function POST(
    request: Request,
    { params }: { params: { id: number } }
) {

    const formData = await request.formData();

    const items: any = Array.from(formData);

    const text = items.find((item: any) => item[0] === "text")[1];
    const essense = items.find((item: any) => item[0] === "essense")[1];
    const essense_id = items.find((item: any) => item[0] === "essense_id")[1];

    const images = items.find((item: any) => item[0] === "essense_id")[1];
    console.log(items);


    const messageId = await saveMessage(text, essense, essense_id, 13);

    if (!messageId) {
        return NextResponse.json({
            success: false,
        });
    }

    return NextResponse.json({
        success: true,
        messageId,
    });
}

async function saveMessage(text: string, essense: string, essense_id: number, sender: number): Promise<number | false> {
    return new Promise((resolve) => {
        pool.query(
            "INSERT INTO messages (text,essense,essense_id,sender) VALUES (?,?,?,?)",
            [text, essense, essense_id, sender],
            function (err, result: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#mckdj3",
                                error: err,
                                values: { text, essense, essense_id }
                            }, null, 2),
                        "5050441344"
                    )
                    resolve(false)
                }
                if (result) {
                    resolve(result.insertId)
                }
            }
        )
    })
}