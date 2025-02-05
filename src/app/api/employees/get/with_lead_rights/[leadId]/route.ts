import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { getUserByToken } from "@/app/components/getUserByToken";
import { pool } from "@/app/db/connect";
import dbWorker from "@/app/db/dbWorker/dbWorker";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: { leadId: number } }
) {
    const auth = cookies().get('auth');
    if (!auth?.value) return new Response("Кто ты", { status: 401, });;
    const user = await getUserByToken(auth?.value);
    if (!user) return new Response("Кто ты", { status: 401, });;
    if (!user.is_manager) return new Response("Кто ты", { status: 401, });;

    const { leadId } = params;

    const data = await getEmployeesByLeadId(leadId, Boolean(user.is_boss));

    if (!data) {
        return NextResponse.json({
            success: false,
            error: "#fnf8fg"
        });
    }

    return NextResponse.json({
        success: true,
        leadId,
        data
    });
}

async function getEmployeesByLeadId(leadId: number, view_all: boolean): Promise<Employee[] | false> {

    const whereArr = [];

    whereArr.push("employees.is_active = 1");

    if (!view_all) {
        whereArr.push("employees.is_manager = 0");
    }

    const whereString = whereArr.join(" AND ");

    const qs = `SELECT employees.id as user_id, leads_roles.role, employees.username
    FROM employees 
    LEFT JOIN (leads_roles)
    ON (employees.id = leads_roles.user AND leads_roles.lead_id = ?)
    WHERE ${whereString}
    `;


    return new Promise((resolve) => {
        dbWorker(
            qs,
            [leadId],
            function (err, result: any[]) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#mdndm34n",
                                error: err,
                                values: { leadId }
                            }, null, 2),
                        "5050441344"
                    )
                    resolve(false)
                }
                if (!result?.length) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#md8dn3",
                                error: "Запросили сотрудника, которого нет",
                                values: { leadId }
                            }, null, 2),
                        "5050441344"
                    )
                    resolve(false)
                } else {
                    resolve(result)
                }
            }
        )
    })
}

interface Employee {
    id: number
    username: string
    telegram_id: string
    tg_chat_id: number
    leads?: any[]
}