import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { ExpensesPePerPurchaseTaskInterface } from "@/app/components/types/lead";
import { pool } from "@/app/db/connect";

export default async function getExpensesPerPurchaseTask(props: { from?: string; to?: string }): Promise<ExpensesPePerPurchaseTaskInterface[]> {
    const whereArray: [string, string, string][] = [];
    // if (props?.year) {
    //     whereArray.push(["YEAR(created_date)", "=", String(props.year)])
    // }
    const whereString = !whereArray.length
        ? ""
        : ("WHERE " + whereArray.map(([i1, i2, i3]) => `${i1} ${i2} ${i3}`).join(" AND "));

    const qs = `SELECT * FROM expenses_per_purchase_task ${whereString}`;
    return await new Promise(resolve => {
        pool.query(
            qs,
            function (err: any, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify({
                            error: err,
                            code: "#dmddsanNjdu8"
                        }, null, 2),
                        "5050441344"
                    )
                }
                resolve(res ? res : []);
            }
        )
    })
}