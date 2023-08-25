import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { leadId: number } }
) {

    const { leadId } = params;

    const data = await getEmployeesByLeadId(leadId);

    return NextResponse.json({
        success: true,
        leadId,
        data
    });
}

async function getEmployeesByLeadId(leadId: number): Promise<Employee[] | false> {
    return new Promise((resolve) => {
        pool.query(
            `SELECT employees.id as user_id, leads_roles.role, employees.username
            FROM employees 
            LEFT JOIN (leads_roles)
            ON (employees.id = leads_roles.user AND leads_roles.lead_id = ?)
            WHERE employees.is_active = 1
            `,
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
                if (!result.length) {
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