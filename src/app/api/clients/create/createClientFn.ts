import { pool } from "@/app/db/connect";
import { sendMessageToTg } from "../../bugReport/route";

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
                if (res){

                    r(res.insertId);
                }
            })
    })

}