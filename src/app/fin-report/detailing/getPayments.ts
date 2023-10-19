import { sendMessageToTg } from "../../api/bugReport/sendMessageToTg";
import { PaymentInterface } from "../../components/types/lead";
import { pool } from "../../db/connect";
// import { ReportSearchInterface } from "./page";

// export default async function getFinReportdata(searchParams: ReportSearchInterface) {
//     const payments = await getPayments(searchParams);
//     return {
//         payments,
//     };
// }

export default async function getPayments(props: { from?: string }): Promise<PaymentInterface[]> {

    return await new Promise(resolve => {

        const whereArray: [string, string, string][] = [];
        // if (props?.year) {
        //     whereArray.push(["YEAR(created_date)", "=", String(props.year)])
        // }
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
