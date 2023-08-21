import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";

export async function POST(
    request: Request,
) {
    const resquestData = await request.json();
    if (resquestData.code) {
        const user: any = await getUserByCode(resquestData.code);
        if (user) {
            const newToken = generateRandomString();
            const updated = await insertCodeToDb(newToken, user.id);
            if (updated) {
                return NextResponse.json({
                    success: true,
                    token: newToken,
                    user:user.username,
                });
            } else {
                return NextResponse.json({
                    success: false,
                });
            }
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

function generateRandomString() {
    const length = 20;
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }
    return result;
}



async function insertCodeToDb(token: string, userId: number) {
    return await new Promise(resolve => {
        pool.query(
            "UPDATE employees SET token = ? WHERE id = ?",
            [token, userId],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#mdn8sd6d5f",
                                error: err,
                                values: { token, userId }
                            }, null, 2),
                        "5050441344"
                    )
                }
                resolve(res?.changedRows);
            }
        )
    })
}