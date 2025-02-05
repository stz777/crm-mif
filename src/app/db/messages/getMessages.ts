import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg"
import { EmployeeRoleInEssense, Media, MessageForChatInterface, MessageInterface } from "@/app/components/types/messages";
import { pool } from "@/app/db/connect"
import getEployeeByID from "../employees/getEployeeById";
import { EssenseName } from "@/app/components/types/essenses";
import dbWorker from "../dbWorker/dbWorker";

export default async function getMessages(essense: EssenseName, essense_id: number): Promise<MessageForChatInterface[]> {

    const messages: MessageInterface[] = await new Promise((resolve) => {
        dbWorker(
            `SELECT * FROM messages WHERE essense = ? AND essense_id = ? ORDER BY messages.id DESC`,
            [essense, essense_id],
            function (err, result: any[]) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#dkajhdYj",
                                error: err,
                                values: { essense, essense_id }
                            }, null, 2),
                        "5050441344"
                    )
                    resolve([])
                }
                resolve(result)
            }
        )
    });

    const outputData: MessageForChatInterface[] = [];
    for (let index = 0; index < messages.length; index++) {
        const message = messages[index];
        const media = await getMediaByMessageId(message.id);
        const employee = await getEployeeByID(message.sender);
        const employeeRoleInEssense = await getEployeeRoleInEssenseBy(message.sender, essense, essense_id);
        outputData.push({
            message,
            employee,
            media,
            employeeRoleInEssense
        })
    }
    return outputData;
}

async function getMediaByMessageId(messageId: number): Promise<Media[]> {
    return await new Promise((resolve) => {
        dbWorker(
            `SELECT * FROM media WHERE message = ?`,
            [messageId],
            function (err, result: any[]) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#djahhgY",
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
async function getEployeeRoleInEssenseBy(employee_id: number, essense: EssenseName, essense_id: number): Promise<EmployeeRoleInEssense> {

    const table: any = {
        lead: {
            table: "leads_roles",
            column: "lead_id"
        },
        purchase_task: {
            table: "purchasing_task_roles",
            column: "task"
        },
        project: {
            table: "projects_roles",
            column: "project"
        },
    }

    return await new Promise((resolve) => {
        dbWorker(
            `SELECT role FROM ${table[essense].table} WHERE ${table[essense].column} = ? AND user = ?`,
            [essense_id, employee_id],
            function (err, result: any[]) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#djahhgY",
                                error: err,
                                values: {
                                    employee_id, essense, essense_id
                                }
                            }, null, 2),
                        "5050441344"
                    )
                }
                if (!result.length) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#djahhTy",
                                error: "Не нашли роль пользователя",
                                values: {
                                    employee_id, essense, essense_id
                                },
                                sql: `SELECT role FROM ${table[essense].table} WHERE ${table[essense].column} = ${essense_id} AND user = ${employee_id}`
                            }, null, 2),
                        "5050441344"
                    )
                }
                resolve(result.pop())
            }
        )
    });
}