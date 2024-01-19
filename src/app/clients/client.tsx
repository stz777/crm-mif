"use client"

import Link from "next/link"
import { ClientInterface, ClientsSearchInterface } from "../components/types/clients"
import { JSXElementConstructor, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react"
import clientMetaTypeTranslator from "./clientMetaTypeTranslator"
import ClientMetaValueViewer from "./ClientMetaValueViewer"
import SideModal from "@/components/SideModal/SideModal"
import ClientsHeader from "./header/ClientsHeader"
import fetchClients from "./fetchClients"
import Wrapper from "./wrapper"
import Phone from "../leads/get/Phone"
import { LeadInterface } from "../components/types/lead"
import dayjs from "dayjs"

export default function Client(props: { searchParams: ClientsSearchInterface, defaultClients: ClientInterface[] }) {
    const [clients, setClients] = useState(props.defaultClients);

    useEffect(() => {
        let mount = true;
        (async function refreshData() {
            if (!mount) return;
            await new Promise(resolve => { setTimeout(() => { resolve(1); }, 1000); });
            const response = await fetchClients(props.searchParams);
            if (JSON.stringify(clients) !== JSON.stringify(response.clients)) {
                setClients(response.clients);
            }
            await refreshData();
        })();
        return () => { mount = false; }
    }, [clients, props.searchParams])

    return <>
        <h1>Клиенты</h1>
        <div className="mt-4">
            <ClientsHeader searchParams={props.searchParams} />
            <div className="my-5"></div>
            <table className="table  w-auto">
                <thead>
                    <tr className="sticky-top">
                        <th>ID</th>
                        <th>Наименование</th>
                        <th>Контакты</th>
                        <th>Адрес</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {clients.map((client, i) => <LeadTr key={client.id} client={client}>
                        <td>{client.id}</td>
                        <td>{client.full_name}</td>
                        <td>
                            <table className="w-100">
                                <tbody>
                                    {client.meta.map((meta) => <tr key={meta.id}>
                                        <td style={{width:50}}>
                                            <span className="me-4">{clientMetaTypeTranslator[meta.data_type] || meta.data_type}</span>
                                        </td>
                                        <td className="text-left">
                                            <ClientMetaValueViewer type={meta.data_type} data={meta.data} />
                                        </td>
                                    </tr>)}
                                </tbody>
                            </table>
                        </td>
                        <td>{client.address}</td>
                        <td>
                            <div className="d-flex">
                                <div className="me-2"><Link className="btn btn-outline-dark btn-sm text-nowrap" href={`/leads/create/${client.id}`}>Создать заказ</Link></div>
                                <div><Link className="btn btn-outline-dark btn-sm text-nowrap" href={`/clients/edit/${client.id}`}>Редактировать клиента</Link></div>
                            </div>
                        </td>
                    </LeadTr>)}
                </tbody>
            </table>
        </div>
    </>
}

function LeadTr(props: {
    client: ClientInterface,
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

                <ClientDetails client={props.client} />
            </>
        </SideModal>
    </>
}

function ClientDetails(props: { client: ClientInterface }) {
    return <>
        <div className="d-flex align-items-center border-bottom px-4 py-3 ">
            <div className="h3">Данные клиента</div>
            <span className="ms-3 text-secondary" style={{ fontSize: "0.9em" }}>ID: {props.client.id}</span>
        </div>
        <div className="px-4">
            <Wrapper title="Наименование">
                {props.client.full_name}
            </Wrapper>
            <Wrapper title="Телефон">
                {
                    props.client.meta.filter(item => item.data_type === "phone").map((item, i) => <div key={item.id}>
                        {i > 0 && <div className="mt-2"></div>}
                        <Phone phone={item.data} />
                    </div>)
                }
            </Wrapper>
            <Wrapper title="Email">
                {
                    props.client.meta.filter(item => item.data_type === "email").map((item, i) => <div key={item.id}>
                        {i > 0 && <div className="mt-2"></div>}
                        {item.data}
                    </div>)
                }
            </Wrapper>
            <Wrapper title="Telegram">
                {
                    props.client.meta.filter(item => item.data_type === "telegram").map((item, i) => <div key={item.id}>
                        {i > 0 && <div className="mt-2"></div>}
                        {item.data}
                    </div>)
                }
            </Wrapper>
            <Wrapper title="Адрес">
                {props.client.address}
            </Wrapper>
            <div className="my-5"></div>
            <h5>Заказы</h5>
            <ClientLeads client_id={props.client.id} />
        </div>
    </>
}


function ClientLeads(props: { client_id: number }) {
    const [leads, setLeads] = useState<LeadInterface[] | undefined>();

    useEffect(() => {
        let mount = true;
        (async function refreshData() {
            if (!mount) return;
            await new Promise(resolve => { setTimeout(() => { resolve(1); }, 1000); });
            const response = await fetchClientLeads(props.client_id);
            if (JSON.stringify(leads) !== JSON.stringify(response.leads)) {
                setLeads(response.leads);
            }
            await refreshData();
        })();
        return () => { mount = false; }
    }, [leads])

    if (!leads) return <>Загрузка...</>;
    if (!leads.length) return <>Нет заказов</>

    return <>
        <table className="table">
            <thead>
                <tr>
                    <th className="text-secondary">ID</th>
                    <th className="text-secondary">Описание</th>
                    <th className="text-secondary">Создан</th>
                    <th className="text-secondary">Сумма ₽</th>
                </tr>
            </thead>
            <tbody>
                {leads.map(lead => <tr key={lead.id}>
                    <td>{lead.id}</td>
                    <td>{lead.description}</td>
                    <td>{dayjs(lead.created_date).format("DD.MM.YYYY")}</td>
                    <td>{lead.sum}</td>
                </tr>)}
                <tr>
                    <th>Всего</th>
                    <td></td>
                    <td></td>
                    <td>{leads.map(({ sum }) => sum).reduce((a, b) => a + b)}</td>
                </tr>
            </tbody>
        </table>
    </>
}


async function fetchClientLeads(lead_id: number): Promise<{
    leads: LeadInterface[]
}> {
    return fetch(
        `/api/leads/get/by-client-id/${lead_id}`,
        {
            method: "POST"
        }
    )
        .then(x => x.json())
}