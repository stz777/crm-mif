import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { PaymentInterface } from "@/app/components/types/lead";
import { pool } from "@/app/db/connect";


export default async function getPayments(props: { year: number, month: number }): Promise<PaymentInterface[]> {

    return await new Promise(resolve => {

        const whereArray: [string, string, string][] = [];
        
        whereArray.push(["YEAR(created_date)", "=", String(props.year)])
        whereArray.push(["MONTH(created_date)", "=", String(props.month)])
        const whereString = !whereArray.length
            ? ""
            : ("WHERE " + whereArray.map(([i1, i2, i3]) => `${i1} ${i2} ${i3}`).join(" AND "));

        const qs = `SELECT * FROM payments ${whereString} `;

        pool.query(
            qs,
            function (err: any, res: PaymentInterface[]) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify({
                            error: err,
                            code: "#kd9d7dh3mnhH"
                        }, null, 2),
                        "5050441344"
                    )
                }
                resolve(res ? res : []);
            }
        )
    })
}
