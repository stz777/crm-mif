"use client"
import Link from "next/link";
import ConfirmPayment from "./confirmPayment";
import DeclinePayment from "./declinePayment";
import CloseLead from "./closeLead";
import { RightsManagement } from "./righsManagement/rightsManagement";
import { LeadInterface } from "@/app/components/types/lead";
import { Add_Payment } from "./add_payment";
import { FaCheck } from "react-icons/fa"
import dayjs from 'dayjs'
import { useEffect, useState } from "react";
import { AddExpense } from "./addExpense";
import { toast } from "react-toastify";

export default function Client(props: { leads: LeadInterface[], is_manager: boolean, is_boss: boolean, searchParams: any }) {
    const [leads, setLeads] = useState(props.leads)
    useEffect(() => {
        let mount = true;
        (async function refreshData() {
            if (!mount) return;
            await new Promise(resolve => { setTimeout(() => { resolve(1); }, 1000); });
            const response = await fetchLeads(props.searchParams);
            if (JSON.stringify(props.leads) !== JSON.stringify(response.leads)) setLeads(response.leads);
            await refreshData();
        })();
        return () => { mount = false; }
    }, [])
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
                    {props.is_manager && <th>Расходы</th>}
                    {props.is_manager && <th>оплаты</th>}
                    <th>оплата</th>
                    <th>аванс</th>
                    {props.is_manager && <th>сумма заказа</th>}
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
                        const date1 = dayjs(lead.deadline).set("hour", 0).set("minute", 0);
                        const date2 = dayjs(lead.created_date).set("hour", 0).set("minute", 0);
                        const diffInDays = date1.diff(date2, 'day');
                        const limit = 1;
                        if (lead.done_at) return <span className="badge text-bg-success">выполнено</span>
                        if (diffInDays <= limit) return <span className="badge text-bg-danger">срочно</span>
                        if (diffInDays > limit) return <span className="badge text-bg-warning">в работе</span>
                        return <>{diffInDays}</>
                    })()}</td>
                    <td>{lead.description}</td>{/*description*/}

                    {props.is_manager && <td>
                        <ul className="list-group">
                            {lead.expensesPerLead?.map(expense =>
                                <li key={expense.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>{expense.sum}</div>
                                    <div>{expense.comment}</div>
                                </li>)}

                            <li className="list-group-item">
                                {(() => {
                                    let totalSum = 0;
                                    if (lead.expensesPerLead?.length) {
                                        totalSum = lead.expensesPerLead
                                            .map(({ sum }) => sum)
                                            .reduce((a, b) => a + b);
                                    }
                                    return <>
                                        <div className="fw-bold">Σ {totalSum}</div>
                                    </>
                                })()}</li>
                        </ul>
                        <div className="mt-2"><AddExpense lead_id={lead.id} /></div>
                    </td>}{/*expenses list*/}
                    {props.is_manager && <td>
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
                    </td>}{/*payments list*/}
                    {<td>
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
                    </td>}{/*оплата полностью проведена*/}
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
                    {props.is_manager && <td>{lead.sum}</td>}{/*сумма заказа*/}
                    <td>
                        <span className="text-nowrap">{lead.done_at ? dayjs(lead.done_at).format("DD.MM.YYYY HH:mm") : "-"}</span>
                    </td>{/*дата выполнения*/}
                    <td>
                        <div className="d-flex nowrap">
                            {(() => {
                                if (lead.done_at) return <>Заказ закрыт</>
                                if (props.is_boss) return <CloseLead leadId={lead.id} />
                                return <>В работе</>
                            })()}
                            {props.is_boss && <div className="ms-2"><RightsManagement leadId={lead.id} /></div>}
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

async function fetchLeads(searchParams: any) {
    return fetch(
        "/api/leads/get",
        {
            method: "POST",
            body: JSON.stringify(searchParams)
        }
    ).then(
        response => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error(response.statusText);
            }
        }
    ).then(data => {
        if (data.success) {
            if (!data.leads) {
                toast.error("Что-то пошло не так #dnajsd3J");
            }
            return data;
        } else {
            toast.error("Что-то пошло не так #mdnasdj3");
        }
    })
        .catch(error => {
            const statusText = String(error);
            fetch(
                `/api/bugReport`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        text: {
                            err: "#dnsdcds8",
                            data: {
                                statusText,
                                values: {}
                            }
                        }
                    })
                }
            )
                .then(x => x.json())
                .then(x => {
                    console.log(x);
                })
        })
}