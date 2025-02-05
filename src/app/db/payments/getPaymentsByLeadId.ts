import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { PaymentInterface } from "@/app/components/types/lead";
import { pool } from "../connect";
import dbWorker from "../dbWorker/dbWorker";

export async function getPaymentsByLeadId(leadId: number): Promise<PaymentInterface[]> {
    return await new Promise(r => {
        dbWorker(
            `SELECT * FROM payments WHERE lead_id = ${leadId} ORDER BY id DESC`, [],
            function (err: any, res: PaymentInterface[]) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#dm3n5nd9s",
                                error: err,
                                values: { leadId }
                            }, null, 2),
                        "5050441344"
                    )
                }
                r(res);
            }
        )
    });
}