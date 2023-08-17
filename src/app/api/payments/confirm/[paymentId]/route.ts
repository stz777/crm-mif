import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";
// import { sendMessageToTg } from "../../bugReport/sendMessageToTg";

export async function POST(
    request: Request,
    { params }: { params: { paymentId: number } }
) {
    const { paymentId } = params;

    const res = await confirmPayment(paymentId);

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

async function confirmPayment(paymentId: number) {
    return new Promise(resolve => {
        pool.query(
            `UPDATE payments SET confirmed = 1 WHERE id = ?`,
            [paymentId],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#nfnk6k7ln",
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