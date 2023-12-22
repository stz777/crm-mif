"use client"
import { LeadInterface } from "@/app/components/types/lead";
import dayjs from 'dayjs'
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Comment from "./Comment";
import fetchLeads from "./fetchLeads";
import TableHeader from "./TableHeader";
import Urgency from "./Urgency";
import Phone from "./Phone";
import TotalSum from "./TotalSum";

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
            <TableHeader is_archive={!!props.searchParams?.is_archive} />
            <tbody>
                {leads.map(lead => <tr key={lead.id} onClick={() => {
                    toast('вывод окна деталей заказа');
                }}>
                    <td>{lead.id}</td>
                    <td>{lead.description}</td>
                    <td><div onClick={e => e.stopPropagation()}><Comment currentText={lead.comment} lead_id={lead.id} /></div></td>
                    <td>
                        <div>{lead.clientData.full_name}</div>
                        <div><Phone phone={String(lead.clientData.meta.find(item => item.data_type === "phone")?.data)} /></div>
                    </td>
                    <td>{dayjs(lead.created_date).format("DD.MM.YYYY")}</td>
                    <td>
                        {dayjs(lead.deadline).format("DD.MM.YYYY")}
                        <div><Urgency deadline={lead.deadline} done_at={lead.done_at} /></div>
                    </td>
                    {props.is_manager && <td>
                        <TotalSum payments={lead.payments || []} leadSum={lead.sum} />
                    </td>}
                    {props.searchParams?.is_archive && <td>
                        <span className="text-nowrap">{lead.done_at ? dayjs(lead.done_at).format("DD.MM.YYYY HH:mm") : "нет"}</span>
                    </td>}
                </tr>)}
            </tbody>
        </table> : <>нет заказов...</>}
    </>
}

