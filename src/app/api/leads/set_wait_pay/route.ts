import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const data = await request.json();
    const updated = await setWaitPay(data.lead_id)
    if (updated) {
        return NextResponse.json({ success: true, });
    } else {
        return NextResponse.json({ success: false, });
    }
}


async function setWaitPay(lead_id: number) {
    return await new Promise(resolve => {
        pool.query(
            "UPDATE leads SET wait_pay = 1 WHERE id = ?",
            [lead_id],
            function (err: any, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify({
                            code: "#dda123",
                            err,
                            values: {
                                lead_id
                            }
                        })
                    )
                }
                resolve(res?.changedRows)
            }
        )
    })
}