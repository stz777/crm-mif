import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";
import { getUserByToken } from "@/app/components/getUserByToken";
import { cookies } from "next/headers";

export async function POST(
    request: Request,
) {

    const auth = cookies().get('auth');
    if (!auth?.value) return new Response("Кто ты", { status: 401, });;
    const user = await getUserByToken(auth?.value);
    if (!user) return new Response("Кто ты", { status: 401, });;
    if (!user.is_manager) return new Response("Кто ты", { status: 401, });;


    const data = await request.json();
    const { title, comment, deadline } = data;
    const new_task_id: number = await new Promise(resolve => {
        pool.query(
            `INSERT INTO purchasing_tasks (title, comment, deadline) VALUES (?,?,?)`,
            [title, comment, deadline],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#djdmasdkj",
                                error: err,
                                values: { title, comment, deadline }
                            }, null, 2),
                        "5050441344"
                    )
                }
                if (res?.insertId) {
                    sendMessageToTg(
                        `Создана закупка #${res.insertId}`,
                        "5050441344"
                    )
                }
                resolve(res?.insertId);
            }
        );
    });

    console.log('new_task_id', new_task_id);


    if (!new_task_id) {

    }


    if (user) {
        await setUserPermissionInTask(user.id, new_task_id, "inspector");
        if (user.id !== 1) await setUserPermissionInTask(1, new_task_id, "inspector");
    }



    if (new_task_id) {
        return NextResponse.json({
            success: true,
        });
    } else {
        return NextResponse.json({
            success: false,
        });
    }
}


async function setUserPermissionInTask(employeeId: number, task_id: number, role: "inspector" | "executor" | "viewer" | "no_rights") {

    return await new Promise(resolve => {
        pool.query(
            `INSERT INTO purchasing_task_roles (user,task,role) VALUES (?,?,?)`,
            [employeeId, task_id, role],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#asdmN7sm4nsS",
                                error: err,
                                values: { employeeId, task_id }
                            }, null, 2),
                        "5050441344"
                    )
                }

                resolve(res?.insertId);
            }
        );
    })

}