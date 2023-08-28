import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";
import { getUserByToken } from "@/app/components/getUserByToken";
import { cookies } from "next/headers";

export async function POST(
    request: Request,
) {
    const auth = cookies().get('auth');
    if (!auth?.value) return new Response("Кто ты", { status: 401, });;
    const user = await getUserByToken(auth?.value);
    if (!user) return new Response("Кто ты", { status: 401, });;
    if (!user.is_manager) return new Response("Кто ты", { status: 401, });;


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