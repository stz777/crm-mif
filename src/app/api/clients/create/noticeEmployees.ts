import getEmployeesByLeadId from "@/app/leads/single/[id]/getEmployeesByLeadId";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";
import translator from "./translator";

export default async function noticeEmployees(essense: string, essense_id: number, username: string, domain: string) {
    let employees;
    if (essense === "lead") {
        employees = await getEmployeesByLeadId(essense_id);
    }

    if (!employees) {
        await sendMessageToTg(
            `Ошибка #err_dksj877`,
            "5050441344"
        );
    }

    if (employees) {
        for (let index = 0; index < employees.length; index++) {
            const { user_id, tg_chat_id } = employees[index];
            if (tg_chat_id) {
                await sendMessageToTg(
                    `Пришло сообщение в ${translator[essense].name} #${essense_id} от ${username}`,
                    String(tg_chat_id)
                );
                await sendMessageToTg(
                    `${domain}${translator[essense].path}${essense_id}`,
                    String(tg_chat_id)
                );
            }
        }
    }
}