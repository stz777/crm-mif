import { pool } from "@/app/db/connect";
import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { LeadInterface, PaymentInterface } from "@/app/components/types/lead";
import getExpensesByLeadId from "../../db/leads/getLeadFullData/getExpensesByLeadId";
import { getUserByToken } from "@/app/components/getUserByToken";
import { cookies } from "next/headers";
import getClientByLeadId from "@/app/db/leads/getLeadFullData/getClientByLeadId";
import { getPaymentsByLeadId } from "./getPaymentsByLeadId";
import { getRoleByLeadId } from "./getRoleByLeadId";

interface SearchParametersInterface {
    id?: number
    client?: number
    is_archive?: "true" | boolean
}

export async function getLeads(
    searchParams
        ?: SearchParametersInterface
): Promise<LeadInterface[]> {
    const auth = cookies().get('auth');
    if (!auth?.value) return [];
    const user = await getUserByToken(auth?.value);
    if (!user) return [];

    const whereArr: string[] = [];

    const ids: string[] = [];

    if (searchParams?.id) {
        ids.push(`id = ${searchParams.id}`)
    }

    whereArr.push(...ids);

    if (searchParams?.client) {
        whereArr.push(`client = ${searchParams.client}`)
    }
    if (searchParams?.is_archive) {
        whereArr.push(`done_at IS NOT NULL`)
    } else {
        whereArr.push(`done_at IS NULL`)
    }

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
                expensesPerLead: await getExpensesByLeadId(leadId),
                clientData: await getClientByLeadId(leadId),
            })
        }
    }

    return output;
}
