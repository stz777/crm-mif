import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";

export async function POST(
    request: Request,
) {
    const data = await request.json();
    const { title, comment, deadline } = data;
    const success = await new Promise(resolve => {

        pool.query(
            `INSERT INTO purchasing_tasks (title, comment, deadline) VALUES (?,?,?)`,
            [title, comment, deadline],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#djdmasdkj",
                                error: err,
                                values: { title, comment, deadline }
                            }, null, 2),
                        "5050441344"
                    )
                }
                if (res?.insertId) {
                    sendMessageToTg(
                        `Создана закупка #${res.insertId}`,
                        "5050441344"
                    )
                }
                resolve(res?.insertId);
            }
        );
    });

    if (success) {
        return NextResponse.json({
            success: true,
        });
    } else {
        return NextResponse.json({
            success: false,
        });
    }
}