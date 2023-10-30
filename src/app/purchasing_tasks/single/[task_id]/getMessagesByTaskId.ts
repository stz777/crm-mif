import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg"
import {  Media } from "@/app/components/types/messages";
import { pool } from "@/app/db/connect"
import { messageToPurchaseTakInterface } from "@/types/messages/messageToPurchaseTakInterface";
//TODO привести чат к нескольким сущностям (leads,purchase_tasks,projects)

export default async function getMessagesByTaskId(task_id: number): Promise<messageToPurchaseTakInterface[]> {
    const messages: messageToPurchaseTakInterface[] = await new Promise((resolve) => {

        pool.query(
            `SELECT * FROM messages WHERE messages.essense = 'purchase_task' AND messages.essense_id=? ORDER BY messages.id DESC`,
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
                    resolve([])
                }
                resolve(result)
            }
        )
    });

    if (!!messages) {
        for (let index = 0; index < messages.length; index++) {
            const message = messages[index];
            messages[index].attachments = await getMediaByMessageId(message.id)
            messages[index].role = await getRole(message.essense_id, message.sender)
            messages[index].username = await getUsername(message.sender)
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



async function getRole(task_id: number, user_id: number): Promise<string> {
    return await new Promise((resolve) => {

        pool.query(
            `SELECT * FROM purchasing_task_roles WHERE task = ? AND user = ?`,
            [task_id, user_id],
            function (err, result: any[]) {

                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#nkLiu8an3nd9",
                                error: err,
                                values: { user_id }
                            }, null, 2),
                        "5050441344"
                    )
                    // resolve([])
                }
                resolve(result[0]?.role || "no_rights")
            }
        )
    });
}


async function getUsername(user_id: number): Promise<string> {
    return await new Promise((resolve) => {

        pool.query(
            `SELECT * FROM employees WHERE id = ?`,
            [user_id],
            function (err, result: any[]) {

                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#nkLmJh7an3nd9",
                                error: err,
                                values: { user_id }
                            }, null, 2),
                        "5050441344"
                    )
                }
                resolve(result[0]?.username || "хз кто")
            }
        )
    });
}