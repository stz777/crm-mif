import { pool } from "@/app/db/connect"
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { Add_Payment } from "./add_payment/add_payment";

import { FaCheck } from "react-icons/fa"



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
                    <th>оплата</th>
                    <th>аванс</th>
                    <th>сумма заказа</th>
                    <th>дата факт. выполнения</th>
                </tr>
            </thead>
            <tbody>
                {leads.map(lead => <tr key={lead.id}>
                    <td>{lead.id}</td> {/*lead id*/}
                    <td>{lead.client}</td>{/*client id*/}
                    <td>{
                        dayjs(lead.deadline)
                            .format("DD.MM.YYYY")
                    }</td>{/*deadline*/}
                    <td>{lead.description}</td>{/*description*/}
                    <td>
                        <pre>{JSON.stringify(lead.payments, null, 2)}</pre>
                        <Add_Payment />
                    </td>{/*payments list*/}
                    <td>
                        {(() => {
                            let totalSum = 0;
                            const leadSum = lead.sum;
                            if (lead.payments?.length) {
                                totalSum = lead.payments
                                    .map(({ sum }) => sum)
                                    .reduce((a, b) => a + b);
                            }
                            const полнаяОплатаПроведена = leadSum <= totalSum;
                            // const totalSum = lead.payments.length === 0 ? 0 : lead.payments;
                            return <CheckPaymentUI done={полнаяОплатаПроведена} />
                        })()}
                    </td>{/*оплата полностью проведена*/}
                    <td>
                        <CheckPaymentUI done={false} />
                    </td>{/*внесена предоплата*/}
                    <td>{lead.sum}</td>{/*сумма заказа*/}
                    <td>{lead.done_at || "-"}</td>{/*дата выполнения*/}
                </tr>)}
            </tbody>
        </table> : <>нет заказов...</>}
    </>
}


function CheckPaymentUI(props: { done: boolean }) {
    return <div className="border border-dark d-flex justify-align-center align-items-middle" style={{
        width: 20, height: 20
    }}>
        {props.done && <FaCheck color="red" />}

    </div>
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
    sum: number
}

