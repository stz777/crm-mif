import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { pool } from "@/app/db/connect"
import Link from "next/link";

export default async function Page() {
    const clients = await getClients();
    return <>
        <h1>Клиенты</h1>
        <table className="table table-bordered table-striped w-auto">
            <thead>
                <tr className="sticky-top">
                    <th>id</th>
                    <th>ФИО</th>
                    <th>Контакты</th>
                    <th />
                </tr>
            </thead>
            <tbody>
                {clients.map((client, i) => <tr key={client.id}>
                    <td>{client.id}</td>
                    <td>{client.full_name}</td>
                    <td>
                        <table className="table">
                            <tbody>
                                {client.meta.map(meta => <tr key={meta.id}>
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



async function getClients(): Promise<ClientInterface[]> {
    const clients: ClientInterface[] = await new Promise(r => {
        pool.query("SELECT * FROM clients", function (err: any, res: ClientInterface[]) {
            if (err) {
                sendMessageToTg(
                    JSON.stringify(
                        {
                            errorNo: "#mdsasd34nd",
                            error: err,
                            values: {}
                        }, null, 2),
                    "5050441344"
                )
            }
            r(res);
        })
    });

    for (let index = 0; index < clients.length; index++) {
        const client = clients[index];
        clients[index].meta = await getClientMeta(client.id);
    }

    return clients;
}



async function getClientMeta(clientId: number): Promise<ClientMetaInterface[]> {
    return await new Promise(r => {
        pool.query(`SELECT * FROM clients_meta WHERE client = ${clientId}`, function (err: any, res: any) {
            if (err) {
                sendMessageToTg(
                    JSON.stringify(
                        {
                            errorNo: "#msk3ng0c",
                            error: err,
                            values: { clientId }
                        }, null, 2),
                    "5050441344"
                )
            }
            r(res);
        })
    });


}


export interface ClientInterface {
    id: number
    full_name: string
    meta: ClientMetaInterface[]
}

export interface ClientMetaInterface {
    id: number
    client: number
    data_type: string
    data: string
}