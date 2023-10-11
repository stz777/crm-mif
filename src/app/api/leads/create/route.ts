import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";
import { cookies } from 'next/headers'
import { getUserByToken } from "@/app/components/getUserByToken";
import getEployeeByID from "@/app/db/employees/getEployeeById";

export async function POST(
    request: Request,
    { params }: { params: { id: number } }
) {

    const auth = cookies().get('auth');
    if (!auth?.value) return new Response("Кто ты", { status: 401, });;
    const user = await getUserByToken(auth?.value);
    if (!user) return new Response("Кто ты", { status: 401, });;
    if (!user.is_manager) return new Response("Кто ты", { status: 401, });;

    const { client, description, title, deadline, sum } = await request.json();

    const leadId: number = await createLead({ client, description, title, deadline, sum });
    if (!leadId) { return NextResponse.json({ success: false }); }
    if (user) {
        await setUserPermissionInLead(user.id, leadId, "inspector");
        if (user.id !== 1) await setUserPermissionInLead(1, leadId, "inspector");
    }
    return NextResponse.json({
        success: true
    });
}


export async function createLead(props: { client: number, description: string, title: string, deadline: string, sum: string }): Promise<number> {
    const { client, description, title, deadline, sum } = props;
    return await new Promise(resolve => {
        pool.query(
            `INSERT INTO leads (client, description, title, deadline, sum, comment) VALUES (?,?,?,?,?,?)`,
            [client, description, title, deadline, sum, "недавно создан"],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#fdsln4bd8d8d",
                                error: err,
                                values: { client, description, title, deadline }
                            }, null, 2),
                        "5050441344"
                    )
                }
                if (res.insertId) {
                    (async () => {
                        sendMessageToTg(
                            `Создан заказ #${res.insertId}`,
                            "5050441344"
                        )
                        const boss = await getEployeeByID(1)
                        sendMessageToTg(
                            `Создан заказ #${res.insertId}`,
                            String(boss.tg_chat_id)
                        )
                    })()
                }
                resolve(Number(res?.insertId));
            }
        );
    })
}

async function setUserPermissionInLead(employeeId: number, leadId: number, role: "inspector" | "executor" | "viewer" | "no_rights") {

    return await new Promise(resolve => {
        pool.query(
            `INSERT INTO leads_roles (user,lead_id,role) VALUES (?,?,?)`,
            [employeeId, leadId, role],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#asdacm4nsS",
                                error: err,
                                values: { employeeId, leadId }
                            }, null, 2),
                        "5050441344"
                    )
                }

                sendMessageToTg(
                    [
                        `Создали новую роль`,
                        "код #dfjfdh",
                        JSON.stringify({ employeeId, leadId, role }, null, 2)
                    ].join("\n"),
                    "5050441344"
                )


                resolve(res?.insertId);
            }
        );
    })

}