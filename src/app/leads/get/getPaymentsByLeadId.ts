import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { PaymentInterface } from "@/app/components/types/lead";
import { pool } from "@/app/db/connect";
import dbWorker from "@/app/db/dbWorker/dbWorker";

export async function getPaymentsByLeadId(leadId: number): Promise<PaymentInterface[]> {
    return await new Promise(r => {
        dbWorker(
            `SELECT * FROM payments WHERE lead_id = ${leadId}`,
            [],
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
