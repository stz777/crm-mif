import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";

export async function POST(
    request: Request,
) {

    const { task_id, comment, sum, material } = await request.json();

    pool.query(
        `INSERT INTO expenses_per_purchase_task (purchase_task, comment, sum, materials) VALUES (?,?,?,?)`,
        [task_id, comment, sum, material],
        function (err, res) {
            if (err) {
                sendMessageToTg(
                    JSON.stringify(
                        {
                            errorNo: "#dh38scds6",
                            error: err,
                            values: { task_id, comment, sum, material }
                        }, null, 2),
                    "5050441344"
                )
            }
        }
    );

    return NextResponse.json({
        success: true,
    });

}