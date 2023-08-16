import { pool } from "@/app/db/connect";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";

export default async function createClientFn(fio: string): Promise<number> {
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
                            `ФИО:  ${fio}`
                        ].join("\n"),
                        "5050441344"
                    )
                    r(res.insertId);
                }
            })
    })

}