import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg"
import { pool } from "@/app/db/connect"

export default async function getMessagesByLeadId(leadId: number): Promise<Message[] | false> {
    return new Promise((resolve) => {
        pool.query(
            `SELECT * FROM messages WHERE essense = 'lead'`,
            [leadId],
            function (err, result: any[]) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#ndam3n93h",
                                error: err,
                                values: { leadId }
                            }, null, 2),
                        "5050441344"
                    )
                    resolve(false)
                }
                resolve(result)
            }
        )
    })
}

interface Message {
    id: number
    text: string
}