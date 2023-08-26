import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { pool } from "@/app/db/connect";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: { id: number } }
) {
    await closeProjectFunction(params.id);

    return NextResponse.json({
        success: true,
    });
}

async function closeProjectFunction(project_id: number) {
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
    return await new Promise(resolve => {
        pool.query(
            `UPDATE projects SET done_at = ? WHERE id = ?`,
            [now, project_id],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#dhHy6c",
                                error: err,
                                values: { now, project_id }
                            }, null, 2),
                        "5050441344"
                    )
                }
                if (res.changedRows) {
                    sendMessageToTg(
                        `Проект #${project_id} закрыт`,
                        "5050441344"
                    )
                }
                resolve(res?.changedRows);
            }
        );
    })
}