import { pool } from "@/app/db/connect";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";
import dbWorker from "@/app/db/dbWorker/dbWorker";

export default async function getCurrentRole(employeeId: number, leadId: number) {
    return await new Promise(resolve => {
        dbWorker(
            `SELECT * FROM leads_roles WHERE user = ? AND lead_id = ?`,
            [employeeId, leadId],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#ms87fhdn3",
                                error: err,
                                values: { employeeId, leadId }
                            }, null, 2),
                        "5050441344"
                    )
                }
                resolve(res?.pop());
            }
        );
    })
}