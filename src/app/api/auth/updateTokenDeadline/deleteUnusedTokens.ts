import { pool } from "@/app/db/connect";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";
import dbWorker from "@/app/db/dbWorker/dbWorker";

export default async function deleteUnusedTokens() {
    return await new Promise(resolve => {
        dbWorker(
            `DELETE FROM tokens WHERE deadline < now();`,
            [],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#mzcn28dj",
                                error: err,
                            }, null, 2),
                        "5050441344"
                    )
                }
                resolve(Number(res?.changedRows));
            }
        )
    })
}