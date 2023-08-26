import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg"
import { pool } from "@/app/db/connect"
import { MessageInterface, Media } from "@/app/leads/single/[id]/getMessagesByLeadId"; //перенести типы в папку types
//TODO привести чат к нескольким сущностям (leads,purchase_tasks,projects)
export default async function getMessagesByTaskId(task_id: number): Promise<MessageInterface[] | false> {
    const messages: MessageInterface[] | false = await new Promise((resolve) => {
        pool.query(
            `SELECT 
                messages.id, messages.text, messages.text, messages.created_date, employees.username, purchasing_task_roles.role
             FROM 
                messages 
             LEFT JOIN (employees)
             ON (employees.id = messages.sender)
             LEFT JOIN (purchasing_task_roles)
             ON (purchasing_task_roles.user = employees.id)
             WHERE messages.essense = 'purchasing_task' AND messages.essense_id=?
             ORDER BY messages.id DESC
             `,
            [task_id],
            function (err, result: any[]) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#dmdnauU7d5",
                                error: err,
                                values: { task_id }
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
                                errorNo: "#ndnan3nd9",
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

// export interface MessageInterface {
//     id: number
//     text: string
//     username: string
//     created_date: string
//     attachments?: Media[]
//     role: string
// }

// export interface Media {
//     id: number
//     name: string
// }