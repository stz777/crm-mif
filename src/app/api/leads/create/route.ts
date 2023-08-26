import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";
import { cookies } from 'next/headers'
import { getUserByToken } from "@/app/components/getUserByToken";


export async function POST(
    request: Request,
    { params }: { params: { id: number } }
) {
    const { client, description, title, deadline, sum } = await request.json();

    const auth = cookies().get('auth');
    const user = await getUserByToken(String(auth?.value));




    const leadId: number = await new Promise(resolve => {
        pool.query(
            `INSERT INTO leads (client, description, title, deadline, sum) VALUES (?,?,?,?,?)`,
            [client, description, title, deadline, sum],
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
                    sendMessageToTg(
                        `Создан заказ #${res.insertId}`,
                        "5050441344"
                    )
                }
                resolve(Number(res?.insertId));
            }
        );
    })

    if (!leadId) { return NextResponse.json({ success: false }); }

    if (user) {
        await setUserPermissionInLead(user.id, leadId, "inspector");
        await setUserPermissionInLead(1, leadId, "inspector");
    }

    return NextResponse.json({
        success: true
    });

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

                resolve(res?.insertId);
            }
        );
    })

}