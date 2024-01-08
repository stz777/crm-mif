"use client"

import Link from "next/link"
import { ClientInterface, ClientsSearchInterface } from "../components/types/clients"
import Filter from "./filter"
import { useState } from "react"

export default function Client(props: { searchParams: ClientsSearchInterface, defaultClients: ClientInterface[] }) {
    const [clients, setClients] = useState(props.defaultClients);
    return <>
        <h1>Клиенты</h1>
        <Filter searchParams={props.searchParams} />
        <table className="table table-bordered table-striped w-auto">
            <thead>
                <tr className="sticky-top">
                    <th>id</th>
                    <th>Наименование</th>
                    <th>Адрес</th>
                    <th>Контакты</th>
                    <th />
                </tr>
            </thead>
            <tbody>
                {clients.map((client, i) => <tr key={client.id}>
                    <td><Link href={`/clients/get/${client.id}`}>Клиент #{client.id}</Link></td>
                    <td>{client.full_name}</td>
                    <td>{client.address}</td>
                    <td>
                        <table className="table">
                            <tbody>
                                {client.meta.map((meta) => <tr key={meta.id}>
                                    <td>
                                        {meta.data_type}
                                    </td>
                                    <td>
                                        {meta.data}
                                    </td>
                                </tr>)}
                            </tbody>
                        </table>
                    </td>
                    <td>
                        <div className="mb-2"><Link className="btn btn-outline-dark btn-sm" href={`/leads/create/${client.id}`}>Создать заказ</Link></div>
                        <div className="mb-2"><Link className="btn btn-outline-dark btn-sm" href={`/clients/edit/${client.id}`}>Редактировать клиента</Link></div>
                    </td>
                </tr>)}
            </tbody>
        </table>
    </>
}