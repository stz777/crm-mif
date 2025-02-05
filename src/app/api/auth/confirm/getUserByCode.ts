import { pool } from "@/app/db/connect"
import { sendMessageToTg } from "../../bugReport/sendMessageToTg"
import dbWorker from "@/app/db/dbWorker/dbWorker"

export default async function getUserByCode(code: string) {
    return await new Promise(resolve => {
        dbWorker(
            "SELECT * FROM employees WHERE password = ? AND is_active = 1",
            [code],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#m2n4b6v7J",
                                error: err,
                                values: { code }
                            }, null, 2),
                        "5050441344"
                    )
                }
                if (res) {
                    resolve(res?.pop())
                } else {
                    resolve(null)
                }
            }
        )
    })
}