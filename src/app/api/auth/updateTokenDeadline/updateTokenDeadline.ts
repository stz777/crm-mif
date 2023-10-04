import { pool } from "@/app/db/connect";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";

export default async function updateTokenDeadline(token: string): Promise<number> {
    return await new Promise(resolve => {
        pool.query(
            `UPDATE tokens SET deadline = (CURRENT_TIMESTAMP + INTERVAL 1 DAY) WHERE token = ?`,
            [token],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#mden28dj",
                                error: err,
                                values: { token }
                            }, null, 2),
                        "5050441344"
                    )
                }
                resolve(Number(res?.changedRows));
            }
        )
    })
}