import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg"
import { pool } from "@/app/db/connect"
import dbWorker from "../dbWorker/dbWorker"

export default async function getEmployeesByProjectId(id: number): Promise<Employee[] | false> {
    return new Promise((resolve) => {
        dbWorker(
            `SELECT projects_roles.user as user_id, projects_roles.role, employees.username, employees.tg_chat_id
            FROM projects_roles 
            LEFT JOIN (employees)
            ON (employees.id = projects_roles.user)
            WHERE projects_roles.project = ?`,
            [id],
            function (err, result: any[]) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#errk3n4",
                                error: err,
                                values: { id }
                            }, null, 2),
                        "5050441344"
                    )
                    resolve(false)
                }
                if (!result.length) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#err4j3nm",
                                error: "Запросили сотрудника, которого нет",
                                values: { id }
                            }, null, 2),
                        "5050441344"
                    )
                    resolve(false)
                } else {
                    resolve(result)
                }
            }
        )
    })
}

interface Employee {
    id: number
    user_id: number
    username: string
    telegram_id: string
    tg_chat_id: number
    role: string;
}