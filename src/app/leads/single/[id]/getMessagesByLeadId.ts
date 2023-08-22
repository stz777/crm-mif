import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg"
import { pool } from "@/app/db/connect"

export default async function getMessagesByLeadId(leadId: number): Promise<MessageInterface[] | false> {
    const messages: MessageInterface[] | false = await new Promise((resolve) => {
        pool.query(
            `SELECT messages.id, messages.text, messages.text, messages.created_date, employees.username
             FROM messages 
             LEFT JOIN (employees)
             ON (employees.id = messages.sender)
             WHERE messages.essense = 'lead' AND messages.essense_id=?`,
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
    });

    if (!!messages) {
        for (let index = 0; index < messages.length; index++) {
            const message = messages[index];
            messages[index].attachments = await getMediaByMessageId(message.id)
        }
    }
    return messages;
}

async function getMediaByMessageId(messageId: number): Promise<Media[]> {
    return await new Promise((resolve) => {
        pool.query(
            `SELECT * FROM media WHERE message = ?`,
            [messageId],
            function (err, result: any[]) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#sjom3m3b4",
                                error: err,
                                values: { messageId }
                            }, null, 2),
                        "5050441344"
                    )
                    resolve([])
                }
                resolve(result)
            }
        )
    });
}

export interface MessageInterface {
    id: number
    text: string
    username: string
    attachments?: Media[]
}

export interface Media {
    id: number
    name: string
}