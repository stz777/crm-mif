import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
// import { ExpensesPerLeadInterface, PaymentInterface } from "@/app/components/types/lead";
import { pool } from "@/app/db/connect";
import dbWorker from "../../dbWorker/dbWorker";

export default async function getExpensesByLeadId(lead_id: number): Promise<any> {
    return await new Promise(r => {
        dbWorker(
            `SELECT * FROM expenses_per_lead WHERE lead_id = ?`,
            [lead_id],
            function (err: any, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#nd7d6dgHt",
                                error: err,
                                values: { lead_id }
                            }, null, 2),
                        "5050441344"
                    )
                }
                r(res);
            }
        )
    });
}