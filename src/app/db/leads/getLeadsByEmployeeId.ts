import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg"
import { LeadInterface } from "@/app/components/types/lead"
import { pool } from "../connect"

export default
    async function getLeadsByEmployeeId(id: number): Promise<LeadInterface[]> {
    return new Promise((resolve) => {
        pool.query(
            `SELECT * from leads
            WHERE 
                id IN (
                    SELECT lead_id FROM leads_roles WHERE user = ?
                )
                ORDER BY id DESC
            ;`,
            [id],
            function (err, result: any[]) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#skfr53md",
                                error: err,
                            }, null, 2),
                        "5050441344"
                    )
                    resolve([])
                }
                if (result) {
                    resolve(result)
                }
            }
        )
    })
}