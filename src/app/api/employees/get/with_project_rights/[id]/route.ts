import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: { id: number } }
) {
    const { id } = params;
    const data = await getEmployeesByProjectId(id);
    return NextResponse.json({
        success: true,
        id,
        data
    });
}

async function getEmployeesByProjectId(task_id: number): Promise<Employee[] | false> {
    return new Promise((resolve) => {
        pool.query(
            `SELECT employees.id as user_id, projects_roles.role, employees.username
            FROM employees 
            LEFT JOIN (projects_roles)
            ON (employees.id = projects_roles.user AND projects_roles.project = ?)
            WHERE employees.is_active = 1
            `,
            [task_id],
            function (err, result: any[]) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#jdhvVhdn",
                                error: err,
                                values: { task_id }
                            }, null, 2),
                        "5050441344"
                    )
                    resolve(false)
                }
                if (!result.length) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#mdjf7hdTy",
                                error: "Запросили сотрудника, которого нет",
                                values: { task_id }
                            }, null, 2),
                        "5050441344"
                    )
                    resolve(false)
                } else {
                    resolve(result)
                }
            }
        )
    })
}

interface Employee {
    id: number
    username: string
    telegram_id: string
    tg_chat_id: number
}