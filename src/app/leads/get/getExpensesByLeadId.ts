import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { ExpensesPerLeadInterface, PaymentInterface } from "@/app/components/types/lead";
import { pool } from "@/app/db/connect";

export default async function getExpensesByLeadId(lead_id: number): Promise<ExpensesPerLeadInterface[]> {
    return await new Promise(r => {
        pool.query(
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