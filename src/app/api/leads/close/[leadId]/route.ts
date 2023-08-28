import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { getUserByToken } from "@/app/components/getUserByToken";
import { pool } from "@/app/db/connect";
import dayjs from "dayjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: { leadId: number } }
) {
    const auth = cookies().get('auth');
    if (!auth?.value) return new Response("Кто ты", { status: 401, });;
    const user = await getUserByToken(auth?.value);
    if (!user) return new Response("Кто ты", { status: 401, });;
    if (!user.is_boss) return new Response("Кто ты", { status: 401, });;


    const { leadId } = params;

    const res = await closeLeadFunction(leadId);
    if (res) {
        return NextResponse.json({
            success: true,
        });
    } else {
        return NextResponse.json({
            success: false,
        });
    }
}


async function closeLeadFunction(leadId: number) {
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss');

    return await new Promise(resolve => {
        pool.query(
            `UPDATE leads SET done_at = ? WHERE id = ?`,
            [now, leadId],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#cm3nskcds9",
                                error: err,
                                values: { now, leadId }
                            }, null, 2),
                        "5050441344"
                    )
                }
                if (res.changedRows) {
                    sendMessageToTg(
                        `Заказ #${leadId} закрыт`,
                        "5050441344"
                    )
                }
                resolve(res?.changedRows);
            }
        );
    })
}