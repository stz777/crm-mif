"use client"

import { FaCheck } from "react-icons/fa";
import { AddExpense } from "../../get/addExpense";
import { Add_Payment } from "../../get/add_payment";
import ConfirmPayment from "../../get/confirmPayment";
import DeclinePayment from "../../get/declinePayment";
import MessageForm from "./messageForm";
import { GenerateWALink } from "./generateWALink";
import Link from "next/link";
import { RightsManagement } from "../../get/righsManagement/rightsManagement";
import Comment from "../../get/Comment";
import dayjs from "dayjs";
import roleTranslator from "@/app/components/translate/roleTranslator";
import CloseLead from "../../get/closeLead";
import Chat from "./chat";
import { LeadFullDatInterface } from "@/app/components/types/fullLeadTypes";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Client(props: {
    lead_fullData: LeadFullDatInterface;
    is_boss: boolean
}) {

    const [state, setState] = useState(props.lead_fullData);

    useEffect(() => {
        let mount = true;
        (async function refreshData() {
            if (!mount) return;
            await new Promise(resolve => { setTimeout(() => { resolve(1); }, 1000); });
            const response = await fetchFullLead(props.lead_fullData.lead.id);
            if (JSON.stringify(state) !== JSON.stringify(response.data)) {
                setState(response.data);
            }
            await new Promise(r => {
                setTimeout(() => {
                    r(1);
                }, 1000);
            })
            await refreshData();
        })();
        return () => { mount = false; }
    }, [props]);
    const data = state || props;

    const {
        lead,
        employees,
        client,
        clientMeta,
        payments,
        expenses,
        messages,
    } = data;

    return <>
        <div className="container-fluid">
            <div className="row">
                <div className="col">
                    <div className="card">
                        <div className="card-header">
                            <h3>Детали заказа</h3>
                        </div>
                        <div className="card-body">
                            <table className='table table-bordered w-auto'>
                                <tbody>
                                    <tr><td>номер</td><td>{lead.id}</td></tr>
                                    <tr><td>описание</td><td>{lead.description}</td></tr>
                                    <tr>
                                        <td>комментарий</td>
                                        <td>
                                            <Comment currentText={lead.comment} lead_id={lead.id} />
                                        </td>
                                    </tr>
                                    <tr><td>стоимость заказа</td><td><span className='fw-bold'>{lead.sum} р</span></td></tr>
                                    <tr><td>дата создания</td><td>{dayjs(lead.created_date).format("DD.MM.YYYY")}</td></tr>
                                    <tr><td>дедлайн</td><td>{dayjs(lead.deadline).format("DD.MM.YYYY")}</td></tr>
                                    <tr><td>ответственные</td>
                                        {!employees ? null : <table className='table'>
                                            <tbody>
                                                {employees.map(employee => <tr key={employee.id}>
                                                    <td>{employee.username}</td>
                                                    <td>{roleTranslator[employee.role]}</td>
                                                </tr>)}
                                            </tbody>
                                        </table>}

                                    </tr>
                                    <tr>
                                        <td>настроить права</td>
                                        <td><RightsManagement
                                            leadId={lead.id}
                                            is_boss={props.is_boss}
                                        /></td>
                                    </tr>

                                    <tr>
                                        <td>
                                            срочность
                                        </td>
                                        <td>
                                            {(() => {
                                                const date1 = dayjs(lead.deadline).set("hour", 0).set("minute", 0).add(1, "hours");
                                                const date2 = dayjs().set("hour", 0).set("minute", 0);
                                                const diffInDays = date1.diff(date2, 'day');
                                                const limit = 1;

                                                if (lead.done_at) return <span className="badge text-bg-success">выполнено</span>
                                                if (diffInDays <= limit) return <span className="badge text-bg-danger">срочно</span>
                                                if (diffInDays > limit) return <span className="badge text-bg-warning">в работе</span>

                                                return <>{diffInDays}</>
                                            })()}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>клиент</td>
                                        <td>
                                            <table>
                                                <tbody>
                                                    <tr><td>id</td><td>
                                                        <Link href={`/clients/get/${client?.id}`}>{client?.id}</Link>
                                                    </td></tr>
                                                    <tr><td>имя</td><td>{client?.full_name}</td></tr>
                                                    <tr><td><span className='pe-3'>
                                                        whatsapp
                                                    </span></td><td>
                                                            {(() => {
                                                                const phoneItem = clientMeta.find(item => item.data_type === "phone");
                                                                if (!phoneItem) return <>телефон не указан</>
                                                                return <GenerateWALink phoneNumber={phoneItem.data} />;
                                                            })()}</td></tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card">
                        <div className="card-header">
                            <h3>Оплаты</h3>
                        </div>
                        <div className="card-body">
                            <ul className="list-group">
                                {payments?.map(payment =>
                                    <li key={payment.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>{payment.sum}</div>
                                        <div>{!payment.confirmed ? <div className="d-flex ms-2">
                                            <ConfirmPayment paymentId={payment.id} />
                                            <DeclinePayment paymentId={payment.id} />
                                        </div> : <><FaCheck color="green" /></>}</div>
                                    </li>)}

                                <li className="list-group-item">{(() => {
                                    let totalSum = 0;
                                    if (payments?.length) {
                                        totalSum = payments
                                            .map(({ sum }) => sum)
                                            .reduce((a, b) => a + b);
                                    }
                                    return <div className="fw-bold">Σ {totalSum}</div>
                                })()}</li>
                            </ul>
                            <Add_Payment lead_id={lead.id} is_boss={!!props.is_boss} />
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card">
                        <div className="card-header">
                            <h3>Расходы</h3>
                        </div>
                        <div className="card-body">
                            <ul className="list-group">
                                {expenses?.map(expense =>
                                    <li key={expense.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>{expense.sum}</div>
                                        <div>{expense.comment}</div>
                                    </li>)}

                                <li className="list-group-item">
                                    {(() => {
                                        let totalSum = 0;
                                        if (expenses?.length) {
                                            totalSum = expenses
                                                .map(({ sum }) => sum)
                                                .reduce((a, b) => a + b);
                                        }
                                        return <>
                                            <div className="fw-bold">Σ {totalSum}</div>
                                        </>
                                    })()}</li>
                            </ul>
                            <AddExpense lead_id={lead.id} />
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card">
                        <div className="card-header">
                            <h3>Статус заказа</h3>
                        </div>
                        <div className="card-body">
                            {(() => {
                                if (lead.done_at) return <>Заказ закрыт</>
                                if (props.is_boss) return <CloseLead leadId={lead.id} />
                                return <>В работе</>
                            })()}
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card">
                        <div className="card-header">
                            <h3>Чат</h3>
                        </div>
                        <div className="card-body">
                            <MessageForm leadId={lead.id} />
                            <div className='mb-4'><Chat messages={messages || []} essense_type="lead" essense_id={lead.id} /></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

async function fetchFullLead(lead_id: number) {
    return fetch(
        `/api/leads/get/${lead_id}`,
        {
            method: "POST",
            body: JSON.stringify({ lead_id })
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
            if (!data.data) {
                toast.error("Что-то пошло не так #dnsd3J");
            }
            return data;
        } else {
            toast.error("Что-то пошло не так #mdna3");
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
                            err: "#dhhcds8",
                            data: {
                                statusText,
                                error,
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