import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg"
import { pool } from "@/app/db/connect"

export default async function getEmployeesByLeadId(leadId: number): Promise<Employee[] | false> {
    return new Promise((resolve) => {
        pool.query(
            `SELECT leads_roles.user as user_id, leads_roles.role, employees.username, employees.tg_chat_id
            FROM leads_roles 
            LEFT JOIN (employees)
            ON (employees.id = leads_roles.user)
            WHERE leads_roles.lead_id = ?`,
            [leadId],
            function (err, result: any[]) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#n4ndc83b",
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
                                errorNo: "#md8dndkdmd3",
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
    user_id: number
    username: string
    telegram_id: string
    tg_chat_id: number
    leads?: any[]
}