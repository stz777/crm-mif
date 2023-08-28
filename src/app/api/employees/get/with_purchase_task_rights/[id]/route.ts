import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { getUserByToken } from "@/app/components/getUserByToken";
import { pool } from "@/app/db/connect";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: { id: number } }
) {

    const auth = cookies().get('auth');
    if (!auth?.value) return new Response("Кто ты", { status: 401, });;
    const user = await getUserByToken(auth?.value);
    if (!user) return new Response("Кто ты", { status: 401, });;
    if (!user.is_boss) return new Response("Кто ты", { status: 401, });;

    
    const { id } = params;

    const data = await getEmployeesByTaskId(id);

    return NextResponse.json({
        success: true,
        id,
        data
    });
}

async function getEmployeesByTaskId(task_id: number): Promise<Employee[] | false> {
    return new Promise((resolve) => {
        pool.query(
            `SELECT employees.id as user_id, purchasing_task_roles.role, employees.username
            FROM employees 
            LEFT JOIN (purchasing_task_roles)
            ON (employees.id = purchasing_task_roles.user AND purchasing_task_roles.task = ?)
            WHERE employees.is_active = 1
            `,
            [task_id],
            function (err, result: any[]) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#dnshHu8",
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
                                errorNo: "#cmdnsi9",
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
    purchase_tasks?: any[] // TODO проблема с неймингом, где-то purchase_task, где-то purchasing-task
}