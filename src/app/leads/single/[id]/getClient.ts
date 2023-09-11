import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg"
import { ClientInterface } from "@/app/components/types/clients"
import { pool } from "@/app/db/connect"

export default async function getClient(clientId: number): Promise<ClientInterface | null> {
    return new Promise((resolve) => {
        pool.query(
            "SELECT * FROM clients WHERE id = ? ORDER BY id DESC",
            [clientId],
            function (err, result: any[]) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#kd03kn4m",
                                error: err,
                                values: { clientId }
                            }, null, 2),
                        "5050441344"
                    )
                    resolve(null)
                }
                if (!result.length) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#n3n6n8m3nc",
                                error: "Запросили клиента, которого нет",
                                values: { clientId }
                            }, null, 2),
                        "5050441344"
                    )
                    resolve(null)
                } else {
                    resolve(result[0])
                }
            }
        )
    })
}