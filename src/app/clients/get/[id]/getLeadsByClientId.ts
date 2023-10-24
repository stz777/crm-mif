import { pool } from "@/app/db/connect";
import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { LeadInterface, PaymentInterface } from "@/app/components/types/lead";
import { getUserByToken } from "@/app/components/getUserByToken";
import { cookies } from "next/headers";
import { getPaymentsByLeadId } from "@/app/db/payments_by_lead/getPaymentsByLeadId";
import getExpensesByLeadId from "@/app/db/leads/getLeadFullData/getExpensesByLeadId";

interface SearchParametersInterface {
    id?: number
    client?: number
    is_archive?: "true" | boolean
}

export async function getLeadsByClientId(
    clientId: number
): Promise<LeadInterface[]> {

    const whereArr: string[] = [];


    whereArr.push(`client = ${clientId}`)



    const whereString = whereArr.length ? "WHERE " + whereArr.join(" AND ") : "";

    const qs = `SELECT * FROM leads ${whereString}  ORDER BY id DESC `;

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
    const output = [];
    for (let index = 0; index < leads.length; index++) {
        const { id: leadId } = leads[index];
        const role = await getRoleByLeadId(leadId);

        if (role) {
            output.push({
                ...leads[index],
                payments: await getPaymentsByLeadId(leadId),
                expensesPerLead: await getExpensesByLeadId(leadId)
            })
        }
    }
    return output;
}


export async function getRoleByLeadId(lead_id: number): Promise<string | null> {
    const auth = cookies().get('auth');
    const user = await getUserByToken(String(auth?.value));
    if (!user) return null;

    if (user.is_boss) return "boss";

    return await new Promise(resolve => {
        pool.query(
            'SELECT role FROM leads_roles WHERE user = ? AND lead_id = ?',
            [user?.id, lead_id],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#mdSmnfjUn28dj",
                                error: err,
                                values: { lead_id },

                            }, null, 2),
                        "5050441344"
                    )
                }
                if (res?.length) {
                    resolve(res[0].role);
                } else {
                    resolve(null);
                }
            }
        )
    })
}
