import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";
import createEmployeeMetaFn from "./createEmployeeMetaFn";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";

export async function POST(
    request: Request,
    { params }: { params: { id: number } }
) {

    const data = await request.json();
    const { username, emails, phones, telegram_id, role } = data;

    const employeeId = await createEmployee(username, telegram_id, Number(role));

    if (!employeeId) return NextResponse.json({
        success: false,
    });

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

    const [employee] = await getEmployeeById(employeeId);

    sendMessageToTg(
        [
            "Создан новый сотрудник",
            employee.username
            // errorNo: "#dmsn3m9c83",
            // error: err,
            // values: { username }
        ].join("\n"),
        "5050441344"
    )

    return NextResponse.json({
        success: true,
    });
}


async function createEmployee(username: string, telegram_id: string, role: number): Promise<number | false> {
    return await new Promise((resolve) => {
        pool.query(
            `INSERT INTO employees (username,telegram_id, is_manager) VALUES (?,?,?)`,
            [username, telegram_id, role],
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


async function getEmployeeById(id: number): Promise<Employee[]> {
    const employees: Employee[] = await new Promise((resolve) => {
        pool.query(
            "SELECT id, username, telegram_id, tg_chat_id FROM employees WHERE id= ?",
            [id],
            function (err: any, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#nddv8en3c",
                                error: err,
                                values: {}
                            }, null, 2),
                        "5050441344"
                    )
                }
                resolve(res);
            }
        )
        // pool.releaseConnection(conn);
        // })
    });

    return employees;

}

interface Employee {
    id: number
    username: string
    telegram_id: string
    tg_chat_id: number
}