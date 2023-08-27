import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";
import { cookies } from 'next/headers'
import { getUserByToken } from "@/app/components/getUserByToken";

export async function POST(
    request: Request,
) {
    const { title, comment, deadline } = await request.json();
    const newProjectId = await createProjectFn(title, comment, deadline)

    const auth = cookies().get('auth');
    const user = await getUserByToken(String(auth?.value));


    if (!newProjectId) {

        return NextResponse.json({
            success: false,
            error: "#mdsavfdyi"
        });
    }

    if (user) {
        await setUserPermissionInProject(user.id, newProjectId, "inspector");
        await setUserPermissionInProject(1, newProjectId, "inspector");
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
                    sendMessageToTg(
                        [
                            `Создан новый проект`,
                            `id: ${res.insertId}`,
                            `Наименование:  ${title}`
                        ].join("\n"),
                        "5050441344"
                    )
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
