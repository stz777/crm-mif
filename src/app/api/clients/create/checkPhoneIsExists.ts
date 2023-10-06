import { pool } from "@/app/db/connect";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";

export default async function checkPhoneIsExists(phone: string) {

    const numbers = phone.replace(/[^0-9]/, "");
    const lastTenChars = numbers.slice(-10);

    return new Promise((resolve) => {
        pool.query(
            'SELECT * FROM clients_meta WHERE data_type = "phone" AND data LIKE ?',
            [`%${lastTenChars}%`],
            function (err, result: any[]) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#skcv7u53md",
                                error: err,
                                values: { phone }
                            }, null, 2),
                        "5050441344"
                    )
                    resolve(false)
                }
                if (result) {
                    resolve(!!result.length)
                }
            }
        )
    });

}