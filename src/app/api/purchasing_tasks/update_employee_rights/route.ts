import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";
import { createNewRole } from "./createNewRole";

export async function POST(
    request: Request,
    { params }: { params: { employeeId: number } }
) {
    const { employeeId, role, task_id } = await request.json();
    
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
        pool.query(
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
        pool.query(
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
        pool.query(
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