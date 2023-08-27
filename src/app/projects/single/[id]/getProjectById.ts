import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { ProjectInterface } from "@/app/components/types/projects";
import { pool } from "@/app/db/connect";

export async function getProjectById(project_id: number): Promise<ProjectInterface> {
    return await new Promise(r => {
        pool.query(
            `SELECT * FROM projects WHERE id = ?`,
            [project_id],
            function (err: any, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#dasdjuYtc",
                                error: err,
                                values: { project_id }
                            }, null, 2),
                        "5050441344"
                    )
                }
                r(res?.pop());
            })
    });
}