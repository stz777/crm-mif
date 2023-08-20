import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";

export async function POST(
    request: Request,
) {
    const resquestData = await request.json();
    if (resquestData.code) {
        const user = await getUserByCode(resquestData.code);
        if (user) {
            return NextResponse.json({
                success: true,
            });
        } else {
            return NextResponse.json({
                success: false,
            });
        }
    }
    return NextResponse.json({
        success: false,
    });
}

async function getUserByCode(code: string) {
    return await new Promise(resolve => {
        pool.query(
            "SELECT * FROM employees WHERE password = ?",
            [code],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#m2n4b6v7J",
                                error: err,
                                values: { code }
                            }, null, 2),
                        "5050441344"
                    )
                }
                if (res) {
                    resolve(res?.pop())
                } else {
                    resolve(null)
                }
            }
        )
    })
}