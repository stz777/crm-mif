import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg"
import { LeadInterface } from "@/app/components/types/lead"
import { pool } from "@/app/db/connect"
import dbWorker from "../../dbWorker/dbWorker"

export default async function getLead(leadId: number): Promise<LeadInterface | false> {
    return new Promise((resolve) => {
        dbWorker(
            "SELECT * FROM leads WHERE id = ? ORDER BY id DESC",
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
