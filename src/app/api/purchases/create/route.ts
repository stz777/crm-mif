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