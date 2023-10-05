import { pool } from "@/app/db/connect"
import { sendMessageToTg } from "../../bugReport/sendMessageToTg"

export default async function saveMessage(text: string, essense: string, essense_id: number, sender: number): Promise<number | false> {
    return new Promise((resolve) => {
        pool.query(
            "INSERT INTO messages (text,essense,essense_id,sender) VALUES (?,?,?,?)",
            [text, essense, essense_id, sender],
            function (err, result: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#mckdj3",
                                error: err,
                                values: { text, essense, essense_id }
                            }, null, 2),
                        "5050441344"
                    )
                    resolve(false)
                }
                if (result) {
                    resolve(result.insertId)
                }
            }
        )
    })
}

