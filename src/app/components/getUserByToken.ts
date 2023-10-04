import { sendMessageToTg } from "../api/bugReport/sendMessageToTg"
import { pool } from "../db/connect"
import { Employee } from "./types/employee"

export async function getUserByToken(token: string): Promise<Employee | undefined> {
    return new Promise(resolve => {
        pool.query(
            `SELECT * FROM employees WHERE id IN (
                SELECT user FROM tokens WHERE token = ?
            )`,
            [token],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify({
                            error: err,
                            code: "#dkdc8d76G"
                        }),
                        "5050441344"
                    )
                }
                resolve(res?.pop())
            }
        )
    })
}