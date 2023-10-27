import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg"
import { ClientMetaInterface } from "@/app/components/types/clients"
import { pool } from "@/app/db/connect"

export default async function getClentMeta(client_id: number): Promise<ClientMetaInterface[]> {
    return new Promise((resolve) => {
        pool.query(
            "SELECT * FROM clients_meta WHERE client = ? ORDER BY id DESC",
            [client_id],
            function (err, result: any[]) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#kdj[kkIykn4m",
                                error: err,
                                values: { client_id }
                            }, null, 2),
                        "5050441344"
                    )
                    resolve([])
                }
                if (!result.length) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#nmmBh87m3nc",
                                error: "Запросили клиента, которого нет",
                                values: { client_id }
                            }, null, 2),
                        "5050441344"
                    )
                    resolve([])
                } else {
                    resolve(result)
                }
            }
        )
    })
}