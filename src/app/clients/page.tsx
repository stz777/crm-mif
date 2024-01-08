import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { getUserByToken } from "@/app/components/getUserByToken";
import { pool } from "@/app/db/connect"
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import Filter from "./filter";
import { getClients } from "./getClients";
import { ClientsSearchInterface } from "@/app/components/types/clients";

export default async function Page(props: { searchParams: ClientsSearchInterface }) {
    const auth = cookies().get('auth');
    if (!auth?.value) return redirect("/");
    const user = await getUserByToken(auth?.value);
    if (!user) return redirect("/");
    if (!user.is_manager) return redirect("/");
    const clients = await getClients(props.searchParams);
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
