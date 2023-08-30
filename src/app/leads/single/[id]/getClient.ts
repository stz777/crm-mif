import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg"
import { pool } from "@/app/db/connect"

export default async function getClient(clientId: number) {
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
                    resolve(false)
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
                    resolve(false)
                } else {
                    resolve(result[0])
                }
            }
        )
    })
}