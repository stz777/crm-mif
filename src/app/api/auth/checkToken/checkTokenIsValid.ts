import { pool } from "@/app/db/connect";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";

export default async function checkTokenIsValid(token: string) {
    return await new Promise(resolve => {
        pool.query(
            `SELECT * FROM tokens 
            WHERE token = ?
            AND deadline > NOW() 
            AND user IN (
                SELECT id FROM employees WHERE is_active = 1
            )`,
            [token],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#mdSmdmdn28dj",
                                error: err,
                                values: { token }
                            }, null, 2),
                        "5050441344"
                    )
                }
                resolve(!!res?.length);
            }
        )
    })
}