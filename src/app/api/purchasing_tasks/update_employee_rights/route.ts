import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";
import { createNewRole } from "./createNewRole";
import { getUserByToken } from "@/app/components/getUserByToken";
import { cookies } from "next/headers";
import dbWorker from "@/app/db/dbWorker/dbWorker";

export async function POST(
    request: Request,
    { params }: { params: { employeeId: number } }
) {

    const auth = cookies().get('auth');
    if (!auth?.value) return new Response("Кто ты", { status: 401, });;
    const user = await getUserByToken(auth?.value);
    if (!user) return new Response("Кто ты", { status: 401, });;
    if (!user.is_boss) return new Response("Кто ты", { status: 401, });;

    const data = await request.json();
    const { employeeId, role, task_id } = data;
    const currentRole = await getCurrentRole(employeeId, task_id);

    if (!currentRole) { //В бд не задана роль

        if (role === "no_rights") { // прислали отмену роли
            return NextResponse.json({
                success: true,
            });
        } else { // прислали новую роль

            const newRoleId = await createNewRole(employeeId, task_id, role);

            if (newRoleId) { // новая роль создалась
                return NextResponse.json({
                    success: true,
                });
            } else { // произошла неведомая хуйня
                return NextResponse.json({
                    success: false,
                });
            }
        }

    } else { // в бд есть роль

        if (role === "no_rights") { // прислали отмену роли
            const deletedRows = await deleteCurrentRole(employeeId, task_id);
            if (deletedRows) {
                return NextResponse.json({
                    success: true,
                });
            } else {
                return NextResponse.json({
                    success: false,
                });
            }
        } else { //прислали новую роль
            const updatedRow = await updateCurrentRole(employeeId, task_id, role);
            if (updatedRow) {
                return NextResponse.json({
                    success: true,
                });
            } else {
                return NextResponse.json({
                    success: false,
                });
            }
        }

    }
}


async function getCurrentRole(employeeId: number, task_id: number) {
    return await new Promise(resolve => {
        dbWorker(
            `SELECT * FROM purchasing_task_roles WHERE user = ? AND task = ?`,
            [employeeId, task_id],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#jdns8Sy",
                                error: err,
                                values: { employeeId, task_id }
                            }, null, 2),
                        "5050441344"
                    )
                }
                resolve(res?.pop());
            }
        );
    })
}


async function deleteCurrentRole(employeeId: number, task_id: number) {
    return await new Promise(resolve => {
        dbWorker(
            `DELETE FROM purchasing_task_roles WHERE user = ? AND task = ?`,
            [employeeId, task_id],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#mdNdN8H",
                                error: err,
                                values: { employeeId, task_id }
                            }, null, 2),
                        "5050441344"
                    )
                }
                if (!res.affectedRows) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#dnajduY",
                                error: "Произошла неведомая хуйня",
                                values: { employeeId, task_id }
                            }, null, 2),
                        "5050441344"
                    )
                }
                resolve(res?.affectedRows);
            }
        );
    })
}


async function updateCurrentRole(employeeId: number, task_id: number, role: string) {
    return await new Promise(resolve => {
        dbWorker(
            `UPDATE purchasing_task_roles SET role = ? WHERE user = ? AND task = ?`,
            [role, employeeId, task_id],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#ndKjJkefvfdo",
                                error: err,
                                values: { employeeId, task_id }
                            }, null, 2),
                        "5050441344"
                    )
                }
                if (!res.affectedRows) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#ncmNh7so4hj",
                                error: "Произошла неведомая хуйня",
                                values: { employeeId, task_id }
                            }, null, 2),
                        "5050441344"
                    )
                }
                resolve(res?.affectedRows);
            }
        );
    })
}