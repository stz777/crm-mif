"use client"
import { LeadInterface } from "@/app/components/types/lead";
import dayjs from 'dayjs'
import { JSXElementConstructor, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Comment from "./Comment";
import fetchLeads from "./fetchLeads";
import TableHeader from "./TableHeader";
import Urgency from "./Urgency";
import Phone from "./Phone";
import TotalSum from "./TotalSum";
import SideModal from "@/components/SideModal/SideModal";
import { useForm } from "react-hook-form";

export default function Client(props: { leads: LeadInterface[], is_manager: boolean, is_boss: boolean, searchParams: any }) {
    const [leads, setLeads] = useState(props.leads);

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
        {leads ? <div>
            <table className="table table-bordered">
                <TableHeader is_archive={!!props.searchParams?.is_archive} />
                <tbody>
                    {leads.map(lead =>
                        <LeadTr lead={lead} key={lead.id}>
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
                        </LeadTr>)}
                </tbody>
            </table>

        </div> : <>нет заказов...</>}
    </>
}

function LeadTr(props: {
    lead: LeadInterface,
    children: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined;
}) {
    const [is_open, setIsOpen] = useState(false);
    return <>
        <tr onClick={() => {
            setIsOpen(true);
        }}>
            {props.children}
        </tr>
        <SideModal isOpen={is_open} closeHandle={() => setIsOpen(false)}>
            <>
                <LeadDetails lead={props.lead} />
            </>
        </SideModal>
    </>
}

function LeadDetails(props: { lead: LeadInterface }) {
    return <>
        <div className="d-flex align-items-center border-bottom px-4 py-3 ">
            <div className="h3" >Детали заказа</div>
            <span className="ms-3 text-secondary" style={{ fontSize: "0.8em" }}>ID: {props.lead.id}</span>
        </div>
        <div className="px-4">
            <div>
                <Wrapper title="Описание">
                    {props.lead.description}
                </Wrapper>
                <Wrapper title="Статус">
                    <CommentForm comment={props.lead.comment} />
                </Wrapper>
                <Wrapper title="Дата создания">
                    {dayjs(props.lead.created_date).format("DD.MM.YYYY")}
                </Wrapper>
                <Wrapper title="Дедлайн">
                    <div className="d-flex">
                        <div className="me-3">{dayjs(props.lead.deadline).format("DD.MM.YYYY")}</div>
                        <Urgency deadline={props.lead.deadline} done_at={props.lead.done_at} />
                    </div>
                </Wrapper>
                <Wrapper title="Ответственные">
                    <></>
                </Wrapper>
            </div>
            {/* <pre>{JSON.stringify(props, null, 2)}</pre> */}
        </div>
    </>
}

function CommentForm(props: { comment: string }) {
    const { register, handleSubmit, reset }: any = useForm<any>({
        defaultValues: {
            comment: props.comment
        }
    })
    return <form>
        <textarea {...register("comment")} className="form-control" placeholder="коммент" />
    </form>
}

function Wrapper(props: {
    title: string;
    children: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined;
}) {
    return <>
        <div className="d-flex mb-2">
            <div style={{ width: 220 }}>{props.title}</div>
            <div>{props.children}</div>
        </div>
    </>
}