"use client"

import Link from "next/link"
import { ClientInterface, ClientsSearchInterface } from "../components/types/clients"
import Filter from "./filter"
import { JSXElementConstructor, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react"
import clientMetaTypeTranslator from "./clientMetaTypeTranslator"
import ClientMetaValueViewer from "./ClientMetaValueViewer"
import SideModal from "@/components/SideModal/SideModal"
import ClientsHeader from "./header/ClientsHeader"
import fetchClients from "./fetchClients"

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
            <Filter searchParams={props.searchParams} />
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
                            <table>
                                <tbody>
                                    {client.meta.map((meta) => <tr key={meta.id}>
                                        <td>
                                            {clientMetaTypeTranslator[meta.data_type] || meta.data_type}
                                        </td>
                                        <td>
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
            <pre>{JSON.stringify(props.client, null, 2)}</pre>
        </div>
    </>
}