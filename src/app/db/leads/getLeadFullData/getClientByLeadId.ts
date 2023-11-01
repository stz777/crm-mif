import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { ClientInterface } from "@/app/components/types/clients";
import { pool } from "@/app/db/connect";

export default async function getClientByLeadId(lead_id: number): Promise<ClientInterface > {
    return new Promise((resolve) => {
        pool.query(
            `SELECT * FROM clients WHERE 
            id IN (SELECT client FROM leads WHERE id = ? )
            ORDER BY id DESC`,
            [lead_id],
            function (err, result: any[]) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#kd55m",
                                error: err,
                                values: { lead_id }
                            }, null, 2),
                        "5050441344"
                    )
                    // resolve(null)
                }
                if (!result.length) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#n328m3nc",
                                error: "Запросили клиента, которого нет",
                                values: { lead_id }
                            }, null, 2),
                        "5050441344"
                    )
                    // resolve(null)
                } else {
                    resolve(result[0])
                }
            }
        )
    })
}