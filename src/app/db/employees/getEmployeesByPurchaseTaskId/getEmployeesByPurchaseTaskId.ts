import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg"
import { Employee } from "@/app/components/types/employee"
import { pool } from "../../connect"

export async function getEmployeesByPurchaseTaskId(task_id: number): Promise<Employee[]> {
    return new Promise((resolve) => {
        pool.query(
            `SELECT employees.id as user_id, purchasing_task_roles.role, employees.username
            FROM employees 
            LEFT JOIN (purchasing_task_roles)
            ON (employees.id = purchasing_task_roles.user AND purchasing_task_roles.task = ?)
            WHERE employees.is_active = 1
            `,
            [task_id],
            function (err, result: any[]) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#dnsvk8u8",
                                error: err,
                                values: { task_id }
                            }, null, 2),
                        "5050441344"
                    )
                    resolve([])
                }
                if (!result.length) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#cmfg6si9",
                                error: "Запросили сотрудника, которого нет",
                                values: { task_id }
                            }, null, 2),
                        "5050441344"
                    )
                    resolve([])
                } else {
                    resolve(result)
                }
            }
        )
    })
}
