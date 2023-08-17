import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";
import createEmployeeMetaFn from "./createEmployeeMetaFn";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";

export async function POST(
    request: Request,
    { params }: { params: { id: number } }
) {

    const data = await request.json();
    const { username, emails, phones, telegram_id } = data;

    const employeeId = await createEmployee(username, telegram_id);

    if (typeof employeeId === "number") {
        for (let index = 0; index < emails.length; index++) {
            const { email } = emails[index];
            await createEmployeeMetaFn({ employee: employeeId, data_type: "email", data: email })
        }
        for (let index = 0; index < phones.length; index++) {
            const { phone } = phones[index];
            await createEmployeeMetaFn({ employee: employeeId, data_type: "phone", data: phone })
        }
    }

    return NextResponse.json({
        success: true,
    });
}


async function createEmployee(username: string, telegram_id: string): Promise<number | false> {
    return await new Promise((resolve) => {
        pool.query(
            `INSERT INTO employees (username,telegram_id) VALUES (?,?)`,
            [username, telegram_id],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#dmsn3m9c83",
                                error: err,
                                values: { username }
                            }, null, 2),
                        "5050441344"
                    )
                    resolve(false);
                }
                if (res) {
                    resolve(res.insertId)
                }
            }
        );
    })
}
