"use client"

import Link from "next/link"
import { ClientInterface, ClientsSearchInterface } from "../components/types/clients"
import {useEffect, useState } from "react"
import clientMetaTypeTranslator from "./clientMetaTypeTranslator"
import ClientMetaValueViewer from "./ClientMetaValueViewer"
import ClientsHeader from "./header/ClientsHeader"
import fetchClients from "./fetchClients"
import LeadTr from "./LeadTr"

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
                                {/* <div className="me-2"><Link className="btn btn-outline-dark btn-sm text-nowrap" href={`/leads/create/${client.id}`}>Создать заказ</Link></div> */}
                                <div><Link className="btn btn-outline-dark btn-sm text-nowrap" href={`/clients/edit/${client.id}`}>Редактировать клиента</Link></div>
                            </div>
                        </td>
                    </LeadTr>)}
                </tbody>
            </table>
        </div>
    </>
}