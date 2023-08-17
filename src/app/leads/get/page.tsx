import { pool } from "@/app/db/connect"
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { Add_Payment } from "./add_payment";
import { FaCheck } from "react-icons/fa"
import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import Link from "next/link";
import ConfirmPayment from "./confirmPayment";
import DeclinePayment from "./declinePayment";

dayjs.locale("ru")


export default async function Page() {
    const leads = await getLeads();

    return <>
        <h1>Заказы</h1>
        {leads ? <table className="table table-bordered">
            <thead>
                <tr>
                    <th>Заказ</th>
                    <th>Клиент</th>
                    <th>создан</th>
                    <th>дедлайн</th>
                    <th>описание</th>
                    <th>оплаты</th>
                    <th>оплата</th>
                    <th>аванс</th>
                    <th>сумма заказа</th>
                    <th>дата факт. выполнения</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {leads.map(lead => <tr key={lead.id}>
                    <td><Link href={`/leads/single/${lead.id}`}>Заказ #{lead.id}</Link></td> {/*lead id*/}
                    <td>{lead.client}</td>{/*client id*/}
                    <td>{dayjs(lead.deadline).format("DD.MM.YYYY")}</td>{/*deadline*/}
                    <td>{dayjs(lead.created_date).format("DD.MM.YYYY")}</td>{/*deadline*/}
                    <td>{lead.description}</td>{/*description*/}
                    <td>
                        <ul className="list-group">
                            {lead.payments?.map(payment =>
                                <li key={payment.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>{payment.sum}</div>
                                    <div>{!payment.confirmed ? <div className="d-flex ms-2">
                                        <ConfirmPayment paymentId={payment.id} />
                                        <DeclinePayment paymentId={payment.id} />
                                    </div> : <><FaCheck color="green" /></>}</div>
                                </li>)}

                            <li className="list-group-item">{(() => {
                                let totalSum = 0;
                                if (lead.payments?.length) {
                                    totalSum = lead.payments
                                        .map(({ sum }) => sum)
                                        .reduce((a, b) => a + b);
                                }
                                return <div className="fw-bold">Σ {totalSum}</div>
                            })()}</li>
                        </ul>
                        <div className="mt-2"><Add_Payment lead_id={lead.id} /></div>
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
                            return <CheckPaymentUI done={полнаяОплатаПроведена} />
                        })()}
                    </td>{/*оплата полностью проведена*/}
                    <td>
                        {(() => {
                            let totalSum = 0;
                            if (lead.payments?.length) {
                                totalSum = lead.payments
                                    .map(({ sum }) => sum)
                                    .reduce((a, b) => a + b);
                            }
                            const предоплатаПроведена = totalSum > 0;
                            return <CheckPaymentUI done={предоплатаПроведена} />
                        })()}
                    </td>{/*внесена предоплата*/}
                    <td>{lead.sum}</td>{/*сумма заказа*/}
                    <td>{lead.done_at || "-"}</td>{/*дата выполнения*/}
                    <td>

                    </td>
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
    confirmed: boolean
    sum: number
}

