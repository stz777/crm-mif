import { pool } from "@/app/db/connect";
import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { LeadInterface, PaymentInterface } from "@/app/components/types/lead";
import getExpensesByLeadId from "./getExpensesByLeadId";

export async function getLeads(): Promise<LeadInterface[]> {
    const leads: LeadInterface[] = await new Promise(r => {
        pool.query(
            "SELECT * FROM leads",
            function (err: any, res: LeadInterface[]) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#mc8c73g3f",
                                error: err,
                                values: {}
                            }, null, 2),
                        "5050441344"
                    )
                }
                r(res);
            }
        )
    });
    for (let index = 0; index < leads.length; index++) {
        const { id: leadId } = leads[index];
        leads[index].payments = await getPaymentsByLeadId(leadId);
        leads[index].expensesPerLead = await getExpensesByLeadId(leadId);
    }
    return leads;
}


async function getPaymentsByLeadId(leadId: number): Promise<PaymentInterface[]> {
    return await new Promise(r => {
        pool.query(
            `SELECT * FROM payments WHERE lead_id = ${leadId}`,
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