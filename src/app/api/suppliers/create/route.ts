import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";
import { getUserByToken } from "@/app/components/getUserByToken";
import { cookies } from "next/headers";
import dbWorker from "@/app/db/dbWorker/dbWorker";

export async function POST(
    request: Request,
) {

    const auth = cookies().get('auth');
    if (!auth?.value) return new Response("Кто ты", { status: 401, });;
    const user = await getUserByToken(auth?.value);
    if (!user) return new Response("Кто ты", { status: 401, });;
    if (!user.is_manager) return new Response("Кто ты", { status: 401, });;

    const data = await request.json();
    const { name, contacts } = data;

    const success = await new Promise(resolve => {
        dbWorker(
            `INSERT INTO suppliers (name, contacts ) VALUES (?,?)`,
            [name, contacts],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#djaScsdasund",
                                error: err,
                                values: { name, contacts }
                            }, null, 2),
                        "5050441344"
                    )
                }
                resolve(Number(res?.insertId));
            }
        );
    });

    if (success) {
        return NextResponse.json({
            success: true,
        });

    } else {
        return NextResponse.json({
            success: false,
        });
    }

}