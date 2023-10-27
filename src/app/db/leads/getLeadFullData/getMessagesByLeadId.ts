import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg"
import { getUserByToken } from "@/app/components/getUserByToken";
import { MessageToLead } from "@/app/components/types/fullLeadTypes";
import { Media } from "@/app/components/types/messages";
import { pool } from "@/app/db/connect"
import { cookies } from "next/headers";


export default async function getMessagesByLeadId(leadId: number): Promise<MessageToLead[]> {

    const auth = cookies().get('auth');

    const employee = await getUserByToken(String(auth?.value));

    const whereArr = [];
    whereArr.push(`messages.essense = 'lead'`)
    whereArr.push(`messages.essense_id=${leadId}`)

    if (!employee?.is_manager) {
        whereArr.push(`text NOT LIKE 'Оплата по заказу:%'`)
    }

    const whereString = ` WHERE ${whereArr.join(" AND ")}`;

    const messages: MessageToLead[] = await new Promise((resolve) => {
        pool.query(
            `SELECT 
                messages.id, messages.text, messages.text, messages.created_date, employees.username, leads_roles.role
             FROM 
                messages 
             LEFT JOIN (employees)
             ON (employees.id = messages.sender)
             LEFT JOIN (leads_roles)
             ON (leads_roles.user = employees.id AND leads_roles.lead_id=${leadId})
             ${whereString}
             ORDER BY messages.id DESC
             `,
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
                    resolve([])
                }
                resolve(result || [])
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