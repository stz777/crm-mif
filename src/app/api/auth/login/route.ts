import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";

export async function POST(
    request: Request,
) {
    const resquestData = await request.json();
    if (resquestData.login) {
        const tg_chat_id = await getUserByTg(resquestData.login);
        if (typeof tg_chat_id === "number") {
            const randomNumber = getRandomNumber(1000, 9999);
            const updated = await insertCodeToDb(randomNumber, tg_chat_id);
            if (updated) {
                sendMessageToTg(
                    `Код доступа ${randomNumber}`,
                    "5050441344"
                )
                return NextResponse.json({
                    success: true,
                });
            } else {
                return NextResponse.json({
                    success: false,
                });
            }
        } else {
            sendMessageToTg(
                JSON.stringify({
                    'title': `Незарегистрированный пользователь прорывается в систему`,
                    data: resquestData
                }, null, 2),
                "5050441344"
            )
            return NextResponse.json({
                success: false,
            });
        }
    }
    return NextResponse.json({
        success: false,
    });
}

async function getUserByTg(tgUsername: string) {
    return await new Promise(resolve => {
        pool.query(
            "SELECT * FROM employees WHERE telegram_id = ?",
            [tgUsername],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#dm4nb7m3",
                                error: err,
                                values: { tgUsername }
                            }, null, 2),
                        "5050441344"
                    )
                }
                const tg_chat_id = res?.pop()?.tg_chat_id;
                if (tg_chat_id) {
                    resolve(Number(tg_chat_id))
                } else {
                    resolve(null)
                }
            }
        )
    })
}

async function insertCodeToDb(code: number, tg_chat_id: number) {
    return await new Promise(resolve => {
        pool.query(
            "UPDATE employees SET password = ? WHERE tg_chat_id = ?",
            [code, tg_chat_id],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#cndm3n5b7J",
                                error: err,
                                values: { code, tg_chat_id }
                            }, null, 2),
                        "5050441344"
                    )
                }
                resolve(res?.changedRows);
            }
        )
    })
}

function getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}