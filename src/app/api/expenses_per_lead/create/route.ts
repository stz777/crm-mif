import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";

export async function POST(
    request: Request,
) {

    const { lead_id, sum, comment } = await request.json();
    const inserted = await insertExpense(lead_id, sum, comment, 2);

    if (inserted) {
        return NextResponse.json({
            success: true,
        });
    } else {
        return NextResponse.json({
            success: false,
        });
    }
}

async function insertExpense(lead_id: number, sum: number, comment: string, done_by: number): Promise<number | undefined> {
    return new Promise(resolve => {
        pool.query(
            `INSERT INTO expenses_per_lead (lead_id, sum, comment, done_by) VALUES (?,?,?,?)`,
            [lead_id, sum, comment, done_by],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#dkdk3nD3mdf",
                                error: err,
                                values: { lead_id, sum }
                            }, null, 2),
                        "5050441344"
                    )
                }
                resolve(res?.insertId);
            }
        );
    })
}