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