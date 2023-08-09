import { pool } from "@/app/db/connect";
import { ClientInterface, ClientMetaInterface } from "../../get/page";
import EditClientForm from "./editClientForm";

export default async function Page({ params }: { params: { id: number } }) {
    const { id } = params;

    const client = await getClient(id)

    return <>
        <h1>Редактирование клиента {id}</h1>
        <EditClientForm clientData={client}/>
    </>
}

async function getClient(clientId: number): Promise<ClientInterface> {
    const clients: ClientInterface[] = await new Promise(r => {
        pool.query(
            `SELECT * FROM clients WHERE id = ${clientId}`,
            function (err: any, res: ClientInterface[]) {
                if (err) {
                    console.log('err #mdsasd34nd', err);
                }
                r(res);
            })
    });
    const client = clients[0];
    client.meta = await getClientMeta(client.id);
    return client;
}


async function getClientMeta(clientId: number): Promise<ClientMetaInterface[]> {
    return await new Promise(r => {
        pool.query(`SELECT * FROM clients_meta WHERE client = ${clientId}`, function (err: any, res: any) {
            if (err) {
                console.log('err #msk3ng0c', err);
            }
            r(res);
        })
    });


}