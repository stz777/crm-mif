import { pool } from "@/app/db/connect"
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { Add_Payment } from "./add_payment/add_payment";
dayjs.locale("ru")

export default async function Page() {
    const leads = await getLeads();

    return <>
        <h1>Заказы</h1>
        {leads ? <table className="table table-bordered">
            <thead>
                <tr>
                    <th>id заказа</th>
                    <th>id клиента</th>
                    <th>дедлайн</th>
                    <th>описание</th>
                    <th>оплаты</th>
                    <th>сумма заказа</th>
                    <th>дата файт. выполнения</th>
                </tr>
            </thead>
            <tbody>
                {leads.map(lead => <tr key={lead.id}>
                    <td>{lead.id}</td>
                    <td>{lead.client}</td>
                    <td>{
                        dayjs(lead.deadline)
                            .format("DD.MM.YYYY")
                    }</td>
                    <td>{lead.description}</td>
                    <td>
                        <div className="d-flex">
                            <div></div>
                            <div></div>
                        </div>
                        <pre>{JSON.stringify(lead.payments, null, 2)}</pre>
                        <Add_Payment />
                        {/* {lead.description} */}
                    </td>
                    <td>{lead.sum}</td>
                    <td>{lead.done_at || "-"}</td>
                </tr>)}
            </tbody>
        </table> : <>нет заказов...</>}
    </>
}

async function getLeads(): Promise<LeadInterface[]> {
    const leads: LeadInterface[] = await new Promise(r => {
        pool.query(
            "SELECT * FROM leads",
            function (err: any, res: LeadInterface[]) {
                if (err) {
                    console.log('err #mc8c73g3f', err);
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
            `SELECT * FROM payments WHERE lead = ${leadId}`,
            function (err: any, res: PaymentInterface[]) {
                if (err) {
                    console.log('err #dm3n5nd9s', err);
                }
                r(res);
            }
        )
    });
}

interface LeadInterface {
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
    declined: boolean
}

