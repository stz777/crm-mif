import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { getUserByToken } from "@/app/components/getUserByToken";
import { pool } from "@/app/db/connect";
import dayjs from "dayjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: { id: number } }
) {

    const auth = cookies().get('auth');
    if (!auth?.value) return new Response("Кто ты", { status: 401, });;
    const user = await getUserByToken(auth?.value);
    if (!user) return new Response("Кто ты", { status: 401, });;
    if (!user.is_boss) return new Response("Кто ты", { status: 401, });;

    await closePurchaseTaskFunction(params.id);

    return NextResponse.json({
        success: true,
    });
}

async function closePurchaseTaskFunction(taskId: number) {
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
    return await new Promise(resolve => {
        pool.query(
            `UPDATE purchasing_tasks SET done_at = ? WHERE id = ?`,
            [now, taskId],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#cm3nCskdcds9",
                                error: err,
                                values: { now, taskId }
                            }, null, 2),
                        "5050441344"
                    )
                }
                if (res.changedRows) {
                    sendMessageToTg(
                        `Задача-закупка #${taskId} закрыта`,
                        "5050441344"
                    )
                }
                resolve(res?.changedRows);
            }
        );
    })
}