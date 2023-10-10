import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";

export async function POST(request: Request, params: { params: { lead_id: string } }) {
    const { comment } = await request.json();
    const { lead_id } = params.params;

    const success = await updateLeadComment(Number(lead_id), comment);
    if (success) {
        return NextResponse.json({
            success: true,
        });
    } else {
        return NextResponse.json({
            success: false,
            error: "#zi4oo"
        });
    }
}

async function updateLeadComment(lead_id: number, comment: string) {
    return await new Promise(resolve => {
        pool.query(
            "UPDATE leads SET comment = ? WHERE id = ?",
            [comment, lead_id],
            function (err: any, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify({
                            code: "#ddzfa123",
                            err,
                            values: {
                                lead_id, comment
                            }
                        })
                    )
                }
                resolve(!!res?.changedRows)
            }
        )
    })
}