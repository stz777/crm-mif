import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";

export async function POST(
    request: Request,
    { params }: { params: { id: number } }
) {
    const { client, description, title, deadline, sum } = await request.json();

    pool.query(
        `INSERT INTO leads (client, description, title, deadline, sum) VALUES (?,?,?,?,?)`,
        [client, description, title, deadline, sum],
        function (err, res: any) {
            if (err) {
                sendMessageToTg(
                    JSON.stringify(
                        {
                            errorNo: "#fdsln4bd8d8d",
                            error: err,
                            values: { client, description, title, deadline }
                        }, null, 2),
                    "5050441344"
                )
            }
            if (res.insertId) {
                sendMessageToTg(
                    `Создан заказ #${res.insertId}`,
                    "5050441344"
                )
            }
        }
    );

    return NextResponse.json({
        success: true,
    });
}