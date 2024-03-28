import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";

export async function POST(request: Request, params: { params: { task_id: string } }) {
    const { comment } = await request.json();
    const { task_id } = params.params;

    const success = await updateLeadComment(Number(task_id), comment);
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

async function updateLeadComment(task_id: number, comment: string) {
    return await new Promise(resolve => {
        pool.query(
            "UPDATE tasks SET comment = ? WHERE id = ?",
            [comment, task_id],
            function (err: any, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify({
                            code: "#ddzfa123",
                            err,
                            values: {
                                task_id, comment
                            }
                        })
                    )
                }
                resolve(!!res?.changedRows)
            }
        )
    })
}