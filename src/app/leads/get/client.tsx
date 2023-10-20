"use client"
import Link from "next/link";
import { LeadInterface } from "@/app/components/types/lead";
import dayjs from 'dayjs'
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import Comment from "./Comment";

export default function Client(props: { leads: LeadInterface[], is_manager: boolean, is_boss: boolean, searchParams: any }) {
    const [leads, setLeads] = useState(props.leads)
    useEffect(() => {
        let mount = true;
        (async function refreshData() {
            if (!mount) return;
            await new Promise(resolve => { setTimeout(() => { resolve(1); }, 1000); });
            const response = await fetchLeads(props.searchParams);
            if (JSON.stringify(leads) !== JSON.stringify(response.leads)) {
                setLeads(response.leads);
            }
            await refreshData();
        })();
        return () => { mount = false; }
    }, [leads])

    return <>
        {leads ? <table className="table table-bordered table-striped">
            <thead className="sticky-top">
                <tr>
                    <th>заказ</th>
                    <th>дедлайн</th>
                    <th>срочность</th>
                    <th>комментарий</th>
                    <th>описание</th>
                    {props.is_manager && <th>расходы</th>}
                    {props.is_manager && <th>оплаты</th>}
                    <th>выполнен</th>
                </tr>
            </thead>
            <tbody>
                {leads.map(lead => <tr key={lead.id}>
                    <td>
                        <Link href={`/leads/single/${lead.id}`} className="">заказ #{lead.id}</Link>
                    </td> {/*lead id*/}
                    <td>{dayjs(lead.deadline).format("DD.MM.YYYY")}</td>{/*deadline*/}
                    <td>{(() => {
                        const date1 = dayjs(lead.deadline).set("hour", 0).set("minute", 0).add(1, "hours");
                        const date2 = dayjs().set("hour", 0).set("minute", 0);
                        const diffInDays = date1.diff(date2, 'day');
                        const limit = 1;

                        if (lead.done_at) return <span className="badge text-bg-success">выполнено</span>
                        if (diffInDays <= limit) return <span className="badge text-bg-danger">срочно</span>
                        if (diffInDays > limit) return <span className="badge text-bg-warning">в работе</span>
                        return <>{diffInDays}</>
                    })()}</td>
                    <td>
                        <Comment currentText={lead.comment} lead_id={lead.id} />
                    </td>{/*description*/}
                    <td>{lead.description}</td>{/*description*/}
                    {props.is_manager && <td>
                        {(() => {
                            let totalSum = 0;
                            if (lead.expensesPerLead?.length) {
                                totalSum = lead.expensesPerLead
                                    .map(({ sum }) => sum)
                                    .reduce((a, b) => a + b);
                            }
                            return <>
                                <div className="fw-bold">{totalSum}</div>
                            </>
                        })()}</td>}{/*expenses list*/}
                    {props.is_manager && <td>
                        {(() => {
                            let totalSum = 0;
                            if (lead.payments?.length) {
                                totalSum = lead.payments
                                    .map(({ sum }) => sum)
                                    .reduce((a, b) => a + b);
                            }
                            return <div className="fw-bold">{totalSum} из <span style={{ fontSize: "1.3em", textDecoration: "underline" }}>{lead.sum}</span></div>
                        })()}
                    </td>}{/*payments list*/}
                    <td>
                        <span className="text-nowrap">{lead.done_at ? dayjs(lead.done_at).format("DD.MM.YYYY HH:mm") : "нет"}</span>
                    </td>{/*дата выполнения*/}
                    
                </tr>)}
            </tbody>
        </table> : <>нет заказов...</>}
    </>
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
                            err: "#dniUcds8",
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