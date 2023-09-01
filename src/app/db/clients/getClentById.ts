import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg"
import { pool } from "@/app/db/connect"

export default async function getClentById(id: number) {
    return new Promise((resolve) => {
        pool.query(
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