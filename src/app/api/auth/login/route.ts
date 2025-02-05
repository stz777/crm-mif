import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";
import { Employee } from "@/app/components/types/employee";
import dbWorker from "@/app/db/dbWorker/dbWorker";

export async function POST(
    request: Request,
) {
    const resquestData = await request.json();
    if (resquestData.login) {
        const employee = await getUserByTg(resquestData.login);

        if (employee) {
            const randomNumber = getRandomNumber(1000, 9999);
            const updated = await insertCodeToDb(randomNumber, employee.tg_chat_id);
            if (updated) {
                sendMessageToTg(
                    `Код доступа ${randomNumber}`,
                    String(employee.tg_chat_id)
                )
                return NextResponse.json({
                    success: true,
                    error: "#dmsdidnneb"
                });
            } else {
                return NextResponse.json({
                    success: false,
                    error: "#sndjdgJnb"
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
                error: "#dndmdjsU"
            });
        }
    }
    return NextResponse.json({
        success: false,
        error: "#mnfdj8dhsK"
    });
}

async function getUserByTg(tgUsername: string): Promise<Employee | null> {
    return await new Promise(resolve => {
        dbWorker(
            "SELECT * FROM employees WHERE telegram_id = ? AND is_active = 1",
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
                const employee = res?.pop();
                if (employee) {
                    resolve(employee)
                } else {
                    resolve(null)
                }
            }
        )
    })
}

async function insertCodeToDb(code: number, tg_chat_id: number) {
    return await new Promise(resolve => {
        dbWorker(
            "UPDATE employees SET password = ? WHERE tg_chat_id = ?",
            [String(code), String(tg_chat_id)],
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