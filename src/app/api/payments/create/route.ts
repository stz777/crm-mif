import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";
import { getUserByToken } from "@/app/components/getUserByToken";
import { cookies } from "next/headers";

export async function POST(
    request: Request,
    { params }: { params: { id: number } }
) {


    const auth = cookies().get('auth');
    if (!auth?.value) return new Response("Кто ты", { status: 401, });;
    const user = await getUserByToken(auth?.value);
    if (!user) return new Response("Кто ты", { status: 401, });;
    if (!user.is_manager) return new Response("Кто ты", { status: 401, });;


    const { lead_id, sum } = await request.json();

    pool.query(
        `INSERT INTO payments (lead_id, sum, done_by) VALUES (?,?,?)`,
        [lead_id, sum, 2],
        function (err, res) {
            if (err) {
                sendMessageToTg(
                    JSON.stringify(
                        {
                            errorNo: "#ckdjn3m3n3oe",
                            error: err,
                            values: { lead_id, sum }
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