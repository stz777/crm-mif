import { pool } from "@/app/db/connect";
import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { ClientInterface, ClientMetaInterface, ClientsSearchInterface } from "@/app/components/types/clients";
import dbWorker from "@/app/db/dbWorker/dbWorker";

export async function getClients(searchParams: ClientsSearchInterface): Promise<ClientInterface[]> {

    const whereArray: [string, string, string][] = [];

    // if (searchParams.phone) {
    //     whereArray.push(["id", "IN", `(SELECT client FROM clients_meta WHERE data_type = 'phone' AND data LIKE '%${searchParams.phone}%')`])
    // }

    const whereString = !whereArray.length
        ? ""
        : ("WHERE " + whereArray.map(([i1, i2, i3]) => `${i1} ${i2} ${i3}`).join(" AND "));

    const qs = `SELECT * FROM clients ${whereString} ORDER BY id DESC`;

    const clients: ClientInterface[] = await new Promise(r => {
        dbWorker(
            qs,
            [],
            function (err: any, res: ClientInterface[]) {
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
        dbWorker(`SELECT * FROM clients_meta WHERE client = ${clientId}`, [], function (err: any, res: any) {
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
