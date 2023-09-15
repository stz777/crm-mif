import { NextResponse } from "next/server";
import { createNewRole } from "./createNewRole";
import { getUserByToken } from "@/app/components/getUserByToken";
import { cookies } from "next/headers";
import getCurrentRole from "./getCurrentRole";

export async function POST(
    request: Request,
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
            const deletedRows: any = await deleteCurrentRole(employeeId, leadId);
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
            const updatedRow: any = await updateCurrentRole(employeeId, leadId, role);
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



function deleteCurrentRole(employeeId: any, leadId: any) {
    throw new Error("Function not implemented.");
}

function updateCurrentRole(employeeId: any, leadId: any, role: any) {
    throw new Error("Function not implemented.");
}

