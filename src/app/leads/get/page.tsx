import { pool } from "@/app/db/connect"
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";

import Client from "./client";

dayjs.locale("ru")

export default async function Page() {
    const leads = await getLeads();
    return <Client leads={leads} />
    
}


async function getLeads(): Promise<LeadInterface[]> {
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

export interface LeadInterface {
    id: number
    client: string
    description: string
    created_date: string
    deadline: string
    done_at: string | null
    sum: number
    payments?: PaymentInterface[]
}

interface PaymentInterface {
    id: number
    lead: number
    done_by: number
    created_date: string
    confirmed: boolean
    sum: number
}

