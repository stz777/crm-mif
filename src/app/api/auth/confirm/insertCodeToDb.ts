import { pool } from "@/app/db/connect";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";

export default async function insertCodeToDb(token: string, userId: number) {
    return await new Promise(resolve => {
        pool.query(
            "UPDATE employees SET token = ? WHERE id = ?",
            [token, userId],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#mdn8sd6d5f",
                                error: err,
                                values: { token, userId }
                            }, null, 2),
                        "5050441344"
                    )
                }
                resolve(res?.changedRows);
            }
        )
    })
}