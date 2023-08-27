import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { Employee } from "@/app/components/types/employee";
import { pool } from "../connect";

export default async function getEployeeByID(id: number): Promise<Employee> {
    return await new Promise((resolve) => {
        pool.query(
            `SELECT * FROM employees WHERE id = ?`,
            [id],
            function (err, result: any[]) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#dkJhGjhdYj",
                                error: err,
                                values: { id }
                            }, null, 2),
                        "5050441344"
                    )
                }
                if(!result.length){
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#jdhGy6",
                                error: "Запросили несуществующего пользователя",
                                values: { id },
                                sql:`SELECT * FROM employees WHERE id = ${id}`
                            }, null, 2),
                        "5050441344"
                    )
                }
                resolve(result.pop())
            }
        )
    });
}