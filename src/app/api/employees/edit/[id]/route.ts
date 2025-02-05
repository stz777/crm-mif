import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { getUserByToken } from "@/app/components/getUserByToken";
import { Employee } from "@/app/components/types/employee";
import { pool } from "@/app/db/connect";
import dbWorker from "@/app/db/dbWorker/dbWorker";
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

    const { email, phone, role, telegram_id, username, is_active } = await request.json();

    const initEmployeeData = await getEmployeeById(params.id);

    await updateEmployeeMeta(params.id, "phone", phone);
    await updateEmployeeMeta(params.id, "email", email);

    await updateSimpleUserData("username", username, params.id);
    await updateSimpleUserData("is_manager", role, params.id);
    await updateSimpleUserData("is_active", is_active, params.id);

    if (telegram_id !== initEmployeeData.telegram_id) {
        await updateSimpleUserData("tg_chat_id", "", params.id);
    }
    await updateSimpleUserData("telegram_id", telegram_id, params.id);

    return NextResponse.json({
        success: true,
    });
}

async function updateEmployeeMeta(employee: number, data_type: string, data: string) {
    return await new Promise(r => {
        dbWorker(
            `UPDATE employees_meta SET data = ? WHERE data_type = ? AND employee_id = ?`,
            [data, data_type, employee],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#dmdsm9NJhdyr",
                                error: {
                                    err,
                                    'текст': "в бд у пользователя не созданы контакты"
                                },
                                values: { data, data_type, employee }
                            }, null, 2),
                        "5050441344"
                    )
                }
                if (!res?.affectedRows) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#dn3Njds",
                                error: err,
                                values: { data, data_type, employee }
                            }, null, 2),
                        "5050441344"
                    )
                }
                r(res);
            })
    })
}

async function updateSimpleUserData(column: string, value: string, employee_id: number) {

    return await new Promise(r => {
        dbWorker(
            `UPDATE employees SET ${column} = ? WHERE id = ?`,
            [value, employee_id],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#dmdsm9Jhdyr",
                                error: err,
                                values: { column, value, employee_id }
                            }, null, 2),
                        "5050441344"
                    )
                }
                if (!res?.affectedRows) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#cmdsn4ndk",
                                error: err,
                                values: { column, value, employee_id }
                            }, null, 2),
                        "5050441344"
                    )
                }
                r(res);
            })
    })
}



async function getEmployeeById(id: number): Promise<Employee> { // TODO удалить функции дубли
    const employees: Employee = await new Promise((resolve) => {
        dbWorker(
            "SELECT id, username, telegram_id, tg_chat_id, is_manager FROM employees WHERE id= ?",
            [id],
            function (err: any, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#mdnNdjs79",
                                error: err,
                                values: {}
                            }, null, 2),
                        "5050441344"
                    )
                }
                if (!res?.length) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#cmdns6G",
                                error: "Запросили сотрудника, которого нет в базе",
                                values: {}
                            }, null, 2),
                        "5050441344"
                    )
                }
                resolve(res.pop());
            }
        )
    });

    return employees;

}
