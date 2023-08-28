import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";
import { createNewRole } from "./createNewRole";
import { getUserByToken } from "@/app/components/getUserByToken";
import { cookies } from "next/headers";

export async function POST(
    request: Request,
    { params }: { params: { employeeId: number } }
) {

    const auth = cookies().get('auth');
    if (!auth?.value) return new Response("Кто ты", { status: 401, });;
    const user = await getUserByToken(auth?.value);
    if (!user) return new Response("Кто ты", { status: 401, });;
    if (!user.is_boss) return new Response("Кто ты", { status: 401, });;

    const { employeeId, role, project_id } = await request.json()

    const currentRole = await getCurrentRole(employeeId, project_id);

    if (!currentRole) { //В бд не задана роль

        if (role === "no_rights") { // прислали отмену роли
            return NextResponse.json({
                success: true,
            });
        } else { // прислали новую роль
            const newRoleId = await createNewRole(employeeId, project_id, role);
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
            const deletedRows = await deleteCurrentRole(employeeId, project_id);
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
            const updatedRow = await updateCurrentRole(employeeId, project_id, role);
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


async function getCurrentRole(employeeId: number, project_id: number) {
    console.log(`SELECT * FROM projects_roles WHERE user = ${employeeId} AND project = ${project_id}`);
    
    return await new Promise(resolve => {
        pool.query(
            `SELECT * FROM projects_roles WHERE user = ? AND project = ?`,
            [employeeId, project_id],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#ms87fhdn3",
                                error: err,
                                values: { employeeId, project_id }
                            }, null, 2),
                        "5050441344"
                    )
                }
                resolve(res?.pop());
            }
        );
    })
}


async function deleteCurrentRole(employeeId: number, project_id: number) {
    return await new Promise(resolve => {
        pool.query(
            `DELETE FROM projects_roles WHERE user = ? AND project = ?`,
            [employeeId, project_id],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#dkdm35n74",
                                error: err,
                                values: { employeeId, project_id }
                            }, null, 2),
                        "5050441344"
                    )
                }
                if (!res.affectedRows) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#dmdj3k",
                                error: "Произошла неведомая хуйня",
                                values: { employeeId, project_id }
                            }, null, 2),
                        "5050441344"
                    )
                }
                resolve(res?.affectedRows);
            }
        );
    })
}


async function updateCurrentRole(employeeId: number, project_id: number, role: string) {
    return await new Promise(resolve => {
        pool.query(
            `UPDATE projects_roles SET role = ? WHERE user = ? AND project = ?`,
            [role, employeeId, project_id],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#ndkdkefvfdo",
                                error: err,
                                values: { employeeId, project_id }
                            }, null, 2),
                        "5050441344"
                    )
                }
                if (!res.affectedRows) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#ncndkso4hj",
                                error: "Произошла неведомая хуйня",
                                values: { employeeId, project_id }
                            }, null, 2),
                        "5050441344"
                    )
                }
                resolve(res?.affectedRows);
            }
        );
    })
}