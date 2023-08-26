import { pool } from "@/app/db/connect";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";

export async function createNewRole(employeeId: number, project_id: number, role: string) {
    return await new Promise(resolve => {
        pool.query(
            `INSERT INTO projects_roles (user,project,role) VALUES (?,?,?)`,
            [employeeId, project_id, role],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#n3asd89v8dj",
                                error: err,
                                values: { employeeId, project_id }
                            }, null, 2),
                        "5050441344"
                    )
                }

                resolve(res?.insertId);
            }
        );
    })
}