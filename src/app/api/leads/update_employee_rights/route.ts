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


    const { employeeId, role, leadId } = await request.json()

    const currentRole = await getCurrentRole(employeeId, leadId);

    if (!currentRole) { //В бд не задана роль

        if (role === "no_rights") { // прислали отмену роли
            return NextResponse.json({
                success: true,
            });
        } else { // прислали новую роль
            const newRoleId = await createNewRole(employeeId, leadId, role);
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
            const deletedRows = await deleteCurrentRole(employeeId, leadId);
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
            const updatedRow = await updateCurrentRole(employeeId, leadId, role);
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


async function getCurrentRole(employeeId: number, leadId: number) {
    return await new Promise(resolve => {
        pool.query(
            `SELECT * FROM leads_roles WHERE user = ? AND lead_id = ?`,
            [employeeId, leadId],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#ms87fhdn3",
                                error: err,
                                values: { employeeId, leadId }
                            }, null, 2),
                        "5050441344"
                    )
                }
                resolve(res?.pop());
            }
        );
    })
}


async function deleteCurrentRole(employeeId: number, leadId: number) {
    return await new Promise(resolve => {
        pool.query(
            `DELETE FROM leads_roles WHERE user = ? AND lead_id = ?`,
            [employeeId, leadId],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#dkdm35n74",
                                error: err,
                                values: { employeeId, leadId }
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
                                values: { employeeId, leadId }
                            }, null, 2),
                        "5050441344"
                    )
                }
                resolve(res?.affectedRows);
            }
        );
    })
}


async function updateCurrentRole(employeeId: number, leadId: number, role: string) {
    return await new Promise(resolve => {
        pool.query(
            `UPDATE leads_roles SET role = ? WHERE user = ? AND lead_id = ?`,
            [role, employeeId, leadId],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#ndkdkefvfdo",
                                error: err,
                                values: { employeeId, leadId }
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
                                values: { employeeId, leadId }
                            }, null, 2),
                        "5050441344"
                    )
                }
                resolve(res?.affectedRows);
            }
        );
    })
}