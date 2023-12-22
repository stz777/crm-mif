"use client"
import { LeadInterface } from "@/app/components/types/lead";
import dayjs from 'dayjs'
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Comment from "./Comment";
import { GenerateWALink } from "../single/[id]/generateWALink";
import fetchLeads from "./fetchLeads";

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
        {leads ? <table className="table table-bordered">
            <thead className="sticky-top">
                <tr className="bordered">
                    <th>ID</th>
                    <th>Описание</th>
                    <th>Статус</th>
                    <th>Клиент</th>
                    <th>Создан</th>
                    <th>Дедлайн</th>
                    {/* <th>Срочность</th> */}
                    {props.is_manager && <th>Оплата, ₽</th>}
                    {props.searchParams?.is_archive && <th>выполнен</th>}
                </tr>
            </thead>
            <tbody>
                {leads.map(lead => <tr key={lead.id} onClick={() => {
                    toast('вывод окна деталей заказа');
                }}>
                    <td>
                        {lead.id}
                    </td> {/*lead id*/}
                    <td>{lead.description}</td>{/*description*/}
                    <td>
                        <div onClick={e => e.stopPropagation()}>
                            <Comment currentText={lead.comment} lead_id={lead.id} />
                        </div>
                    </td>{/*description*/}
                    <td>
                        <div>{lead.clientData.full_name}</div>
                        <div>{(() => {
                            const phone = lead.clientData.meta.find(item => item.data_type === "phone")?.data;
                            return <div onClick={e => e.stopPropagation()} className="d-inline">
                                <GenerateWALink phoneNumber={String(phone)} />
                            </div>
                        })()}</div>
                    </td>
                    <td>
                        {dayjs(lead.created_date).format("DD.MM.YYYY")}
                    </td>{/*created_date*/}
                    <td>
                        {dayjs(lead.deadline).format("DD.MM.YYYY")}
                        <div>
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
                        </div>
                    </td>{/*deadline*/}
                    {props.is_manager && <td>
                        {(() => {
                            let totalSum = 0;
                            if (lead.payments?.length) {
                                totalSum = lead.payments
                                    .map(({ sum }) => sum)
                                    .reduce((a, b) => a + b);
                            }
                            totalSum = 1200;
                            return <div className={`fw-bold ` + ((lead.sum - totalSum) ? "" : "text-success")}>
                                {totalSum} из <span>{lead.sum}</span>
                            </div>
                        })()}
                    </td>}{/*payments list*/}
                    {props.searchParams?.is_archive && <td>
                        <span className="text-nowrap">{lead.done_at ? dayjs(lead.done_at).format("DD.MM.YYYY HH:mm") : "нет"}</span>
                    </td>}{/*дата выполнения*/}
                </tr>)}
            </tbody>
        </table> : <>нет заказов...</>}
    </>
}
