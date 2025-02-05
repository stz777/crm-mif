import { sendMessageToTg } from "../api/bugReport/sendMessageToTg"
import dbWorker from "../db/dbWorker/dbWorker"
import { Employee } from "./types/employee"

export async function getUserByToken(token: string): Promise<Employee | undefined> {
    return new Promise(resolve => {
        dbWorker(
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
                const resss = res?.pop();

                resolve(resss)
            }
        )
    })
}