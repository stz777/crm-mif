import { pool } from "@/app/db/connect";
import { ClientInterface, ClientMetaInterface } from "../../get/page";
import EditClientForm from "./editClientForm";
import { sendBugReport } from "@/app/api/bugReport/route";

export default async function Page({ params }: { params: { id: number } }) {
    const { id } = params;

    const client = await getClient(id)

    return <>
        <h1>Редактирование клиента {id}</h1>
        <EditClientForm clientData={client} />
    </>
}

async function getClient(clientId: number): Promise<ClientInterface> {
    const clients: ClientInterface[] = await new Promise(r => {
        pool.query(
            `SELECT * FROM clients WHERE id = ${clientId}`,
            function (err: any, res: ClientInterface[]) {
                if (err) {
                    sendBugReport(
                        JSON.stringify(
                            {
                                errorNo: "#mdsasd34nd",
                                error: err,
                                values: { clientId }
                            }, null, 2),
                        "5050441344"
                    )
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
                sendBugReport(
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