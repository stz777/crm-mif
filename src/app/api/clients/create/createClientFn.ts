import { pool } from "@/app/db/connect";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";
import { getUserByToken } from "@/app/components/getUserByToken";
import { cookies } from "next/headers";
import getEployeeByID from "@/app/db/employees/getEployeeById";

export default async function createClientFn(fio: string): Promise<number> {
    const boss = await getEployeeByID(1)
    
    return await new Promise(r => {
        pool.query(
            `INSERT INTO clients (full_name) VALUES (?)`,
            [fio],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#djb39f",
                                error: err,
                                values: { fio }
                            }, null, 2),
                        "5050441344"
                    )
                }
                if (res) {
                    sendMessageToTg(
                        [
                            `Создан новый клиент`,
                            `id: ${res.insertId}`,
                            `Наименование:  ${fio}`
                        ].join("\n"),
                        "5050441344"
                    )
                    sendMessageToTg(
                        [
                            `Создан новый клиент`,
                            `id: ${res.insertId}`,
                            `Наименование:  ${fio}`
                        ].join("\n"),
                        String(boss.tg_chat_id)
                    )
                    r(res.insertId);
                }
            })
    })

}