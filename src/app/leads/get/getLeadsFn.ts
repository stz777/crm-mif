import { pool } from "@/app/db/connect";
import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { LeadInterface, PaymentInterface } from "@/app/components/types/lead";
import getExpensesByLeadId from "./getExpensesByLeadId";

interface SearchParametersInterface {
    id?: number
    is_archive?: "true" | boolean
}

export async function getLeads(searchParams
    ?: SearchParametersInterface
): Promise<LeadInterface[]> {

    const whereArr: string[] = [];

    if (searchParams?.id) {
        whereArr.push(`id = ${searchParams.id}`)
    }
    if (searchParams?.is_archive) {
        whereArr.push(`done_at IS NOT NULL`)
    } else {
        whereArr.push(`done_at IS NULL`)
    }

    const whereString = whereArr.length ? "WHERE " + whereArr.join(" AND ") : "";

    const qs = `SELECT * FROM leads ${whereString}`;

    const leads: LeadInterface[] = await new Promise(r => {
        pool.query(
            qs,
            function (err: any, res: any) {
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
