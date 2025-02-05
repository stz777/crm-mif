import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg"
import { ClientInterface } from "@/app/components/types/clients"
import { pool } from "@/app/db/connect"
import dbWorker from "../dbWorker/dbWorker"

export default async function getClentById(id: number): Promise<ClientInterface | false> {
    return new Promise((resolve) => {
        dbWorker(
            "SELECT * FROM clients WHERE id = ? ORDER BY id DESC",
            [id],
            function (err, result: any[]) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#kdj8Gykn4m",
                                error: err,
                                values: { id }
                            }, null, 2),
                        "5050441344"
                    )
                    resolve(false)
                }
                if (!result.length) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#nmNu87m3nc",
                                error: "Запросили клиента, которого нет",
                                values: { id }
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