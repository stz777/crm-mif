import { pool } from "@/app/db/connect"
import { sendMessageToTg } from "../../bugReport/sendMessageToTg"
import dbWorker from "@/app/db/dbWorker/dbWorker"

export default async function insertTokenToDB(token: string, user: number): Promise<number> {
    return await new Promise(resolve => {
        dbWorker(
            "INSERT INTO tokens (user, token) VALUES (?,?)",
            [user, token],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#m2ndpv7J",
                                error: err,
                                values: { token, user }
                            }, null, 2),
                        "5050441344"
                    )
                }
                if (res) {
                    resolve(res.insertId)
                } else {
                    resolve(0)
                }
            }
        )
    })
}