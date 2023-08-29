import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";
import { cookies } from 'next/headers'
import { getUserByToken } from "@/app/components/getUserByToken";
import getEployeeByID from "@/app/db/employees/getEployeeById";

export async function POST(
    request: Request,
) {

    const auth = cookies().get('auth');
    if (!auth?.value) return new Response("Кто ты", { status: 401, });;
    const user = await getUserByToken(auth?.value);
    if (!user) return new Response("Кто ты", { status: 401, });;
    if (!user.is_manager) return new Response("Кто ты", { status: 401, });;


    const { title, comment, deadline } = await request.json();
    const newProjectId = await createProjectFn(title, comment, deadline)



    if (!newProjectId) {

        return NextResponse.json({
            success: false,
            error: "#mdsavfdyi"
        });
    }

    if (user) {
        await setUserPermissionInProject(user.id, newProjectId, "inspector");
        if (user.id !== 1) await setUserPermissionInProject(1, newProjectId, "inspector");
    }

    return NextResponse.json({
        success: true,
    });


}

async function createProjectFn(title: string, comment: string, deadline: string): Promise<number> {
    return await new Promise(r => {
        pool.query(
            `INSERT INTO projects (title, comment, deadline) VALUES (?,?,?)`,
            [title, comment, deadline],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#djshas7",
                                error: err,
                                values: { title, comment, deadline }
                            }, null, 2),
                        "5050441344"
                    )
                    r(0)
                }
                if (res) {
                    (async () => {
                        const boss = await getEployeeByID(1);
                        sendMessageToTg(
                            [
                                `Создан новый проект`,
                                `id: ${res.insertId}`,
                                `Наименование:  ${title}`
                            ].join("\n"),
                            String(boss.tg_chat_id)

                        )
                    })()
                    r(res.insertId);
                }
            })
    })
}

async function setUserPermissionInProject(employeeId: number, project_id: number, role: "inspector" | "executor" | "viewer" | "no_rights") {
    return await new Promise(resolve => {
        pool.query(
            `INSERT INTO projects_roles (user, project, role) VALUES (?, ?, ?)`,
            [employeeId, project_id, role],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#acmdn3m4nsS",
                                error: err,
                                values: { employeeId, project_id }
                            }, null, 2),
                        "5050441344"
                    )
                }
                resolve(res?.insertId);
            }
        );
    })
}
