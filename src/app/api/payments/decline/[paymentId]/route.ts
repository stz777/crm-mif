import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { getUserByToken } from "@/app/components/getUserByToken";
import { pool } from "@/app/db/connect";
import dbWorker from "@/app/db/dbWorker/dbWorker";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
// import { sendMessageToTg } from "../../bugReport/sendMessageToTg";

export async function POST(
    request: Request,
    { params }: { params: { paymentId: number } }
) {
    const auth = cookies().get('auth');
    if (!auth?.value) return new Response("Кто ты", { status: 401, });;
    const user = await getUserByToken(auth?.value);
    if (!user) return new Response("Кто ты", { status: 401, });;
    if (!user.is_boss) return new Response("Кто ты", { status: 401, });;


    const { paymentId } = params;

    const res = await declinePayment(paymentId);

    if (res) {
        return NextResponse.json({
            success: true,
        });
    } else {
        return NextResponse.json({
            success: true,
        });
    }
}

async function declinePayment(paymentId: number) {
    return new Promise(resolve => {
        dbWorker(
            `DELETE FROM payments WHERE id = ?`,
            [paymentId],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#dmnfdm34s",
                                error: err,
                                values: { paymentId }
                            }, null, 2),
                        "5050441344"
                    )
                }
                resolve(res.changedRows);
            })
    })
}