import { pool } from "@/app/db/connect";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";
import dbWorker from "@/app/db/dbWorker/dbWorker";

export default async function createNewRole(employeeId: number, leadId: number, role: string) {
    return await new Promise(resolve => {
        dbWorker(
            `INSERT INTO leads_roles (user,lead_id,role) VALUES (?,?,?)`,
            [employeeId, leadId, role],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#n3nd9v8dj",
                                error: err,
                                values: { employeeId, leadId }
                            }, null, 2),
                        "5050441344"
                    )
                }

                sendMessageToTg(
                    [
                        `Создали новую роль`,
                        "код #фывфыв",
                        JSON.stringify({ employeeId, leadId, role }, null, 2)
                    ].join("\n"),
                    "5050441344"
                )

                resolve(res?.insertId);
            }
        );
    })
}