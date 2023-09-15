import { pool } from "@/app/db/connect";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";

export default async function deleteCurrentRole(employeeId: number, leadId: number) {
    return await new Promise(resolve => {
        pool.query(
            `DELETE FROM leads_roles WHERE user = ? AND lead_id = ?`,
            [employeeId, leadId],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#dkdm35n74",
                                error: err,
                                values: { employeeId, leadId }
                            }, null, 2),
                        "5050441344"
                    )
                }
                if (!res.affectedRows) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#dmdj3k",
                                error: "Произошла неведомая хуйня",
                                values: { employeeId, leadId }
                            }, null, 2),
                        "5050441344"
                    )
                }
                resolve(res?.affectedRows);
            }
        );
    })
}

