import { pool } from "@/app/db/connect";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";
import dbWorker from "@/app/db/dbWorker/dbWorker";

export async function createNewRole(employeeId: number, task_id: number, role: string) {
    return await new Promise(resolve => {
        dbWorker(
            `INSERT INTO purchasing_task_roles (user,task,role) VALUES (?,?,?)`,
            [employeeId, task_id, role],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#n3nnd8v8dj",
                                error: err,
                                values: { employeeId, task_id }
                            }, null, 2),
                        "5050441344"
                    )
                }

                resolve(res?.insertId);
            }
        );
    })
}