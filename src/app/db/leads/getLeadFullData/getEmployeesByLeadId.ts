import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg"
import { pool } from "@/app/db/connect"
import EmployeesCombinedInterface from "@/app/leads/single/[id]/EmployeesCombinedInterface"

export default async function getEmployeesByLeadId(leadId: number): Promise<EmployeesCombinedInterface[]> {
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
                    resolve([])
                }
                if (!result.length) {
                    // console.error("Err #md8dndkdmd3 Запросили сотрудника, которого нет")
                    resolve([])
                } else {
                    resolve(result)
                }
            }
        )
    })
}
