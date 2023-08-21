import { sendMessageToTg } from "../api/bugReport/sendMessageToTg";
import { pool } from "../db/connect";

export default async function getFinReportdata() {
    const payments = await getPayments();
    return {
        payments,
    };
}

async function getPayments() {
    return await new Promise(resolve => {
        pool.query(
            "SELECT * FROM payments",
            function (err: any, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify({
                            error: err,
                            code: "#kd9d7dh3mnhH"
                        }, null, 2),
                        "5050441344"
                    )
                }
                resolve(res);
            }
        )
    })
}