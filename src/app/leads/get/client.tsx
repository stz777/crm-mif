"use client"
import Link from "next/link";
import ConfirmPayment from "./confirmPayment";
import DeclinePayment from "./declinePayment";
import CloseLead from "./closeLead";
import { RightsManagement } from "./righsManagement/rightsManagement";
import { LeadInterface } from "./page";
import { Add_Payment } from "./add_payment";
import { FaCheck } from "react-icons/fa"
import dayjs from 'dayjs'
// import 'dayjs/locale/ru'

export default function Client({ leads }: { leads: LeadInterface[] }) {
    return <>
        <h1>Заказы</h1>
        {leads ? <table className="table table-bordered">
            <thead>
                <tr>
                    <th>Заказ</th>
                    <th>Клиент</th>
                    <th>создан</th>
                    <th>дедлайн</th>
                    <th>срочность</th>
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
                    <td><Link href={`/leads/single/${lead.id}`} className="text-nowrap">Заказ #{lead.id}</Link></td> {/*lead id*/}
                    <td>{lead.client}</td>{/*client id*/}
                    <td>{dayjs(lead.deadline).format("DD.MM.YYYY")}</td>{/*deadline*/}
                    <td>{dayjs(lead.created_date).format("DD.MM.YYYY")}</td>{/*created_date*/}
                    <td>{(() => {
                        const date1 = dayjs(lead.deadline);
                        const date2 = dayjs(lead.created_date);
                        const diffInDays = date1.diff(date2, 'day');
                        const limit = 1;
                        if (lead.done_at) return <span className="badge text-bg-success">выполнено</span>
                        if (diffInDays <= limit) return <span className="badge text-bg-danger">срочно</span>
                        if (diffInDays > limit) return <span className="badge text-bg-warning">в работе</span>
                        return <>{diffInDays}</>
                    })()}</td>
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
                    <td>
                        <span className="text-nowrap">{lead.done_at ? dayjs(lead.done_at).format("DD.MM.YYYY HH:mm") : "-"}</span>
                    </td>{/*дата выполнения*/}
                    <td>
                        <div className="d-flex nowrap">
                            {lead.done_at ? <>Заказ закрыт</> : <CloseLead leadId={lead.id} />}
                            <div className="ms-2"><RightsManagement leadId={lead.id} /></div>
                        </div>
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
