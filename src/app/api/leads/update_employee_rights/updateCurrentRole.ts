import { pool } from "@/app/db/connect";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";

export default async function updateCurrentRole(employeeId: number, leadId: number, role: string) {
    return await new Promise(resolve => {
        pool.query(
            `UPDATE leads_roles SET role = ? WHERE user = ? AND lead_id = ?`,
            [role, employeeId, leadId],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#ndkdkefvfdo",
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
                                errorNo: "#ncndkso4hj",
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