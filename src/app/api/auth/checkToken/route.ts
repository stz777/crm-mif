import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";

export async function POST(
    request: Request,
) {

    const requestData = await request.json();
    if (!requestData.token) {
        return new Response(null, {
            status: 401,
        });
    }

    const tokenIsValid = await checkTokenIsValid(requestData.token);

    if (tokenIsValid) {
        return NextResponse.json({
            success: true,
        });
    } else {
        return new Response(null, {
            status: 401,
        });
    }
}

async function checkTokenIsValid(token: string) {
    return await new Promise(resolve => {
        pool.query(
            "SELECT * FROM employees WHERE token = ? AND is_active = 1",
            [token],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#mdSmdmdn28dj",
                                error: err,
                                values: { token }
                            }, null, 2),
                        "5050441344"
                    )
                }
                resolve(!!res?.length);
            }
        )
    })
}