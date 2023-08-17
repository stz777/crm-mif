import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg"
import { pool } from "@/app/db/connect"

export default async function getLead(leadId: number): Promise<Lead | false> {
    return new Promise((resolve) => {
        pool.query(
            "SELECT * FROM leads WHERE id = ?",
            [leadId],
            function (err, result: any[]) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#skcmdj53md",
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
                                errorNo: "#m3m4n5b6d",
                                error: "Запросили заказ, которого нет",
                                values: { leadId }
                            }, null, 2),
                        "5050441344"
                    )
                    resolve(false)
                } else {
                    resolve(result[0])
                }
            }
        )
    })
}

interface Lead {
    id: number
    client: number
    title: string
    description: string
    created_date: string
    deadline: string
    done_at: string
    sum: number
}