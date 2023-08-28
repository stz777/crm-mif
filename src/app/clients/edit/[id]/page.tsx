import { pool } from "@/app/db/connect";
import { ClientInterface, ClientMetaInterface } from "../../get/page";
import EditClientForm from "./editClientForm";
import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { getUserByToken } from "@/app/components/getUserByToken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: number } }) {

    const auth = cookies().get('auth');
    if (!auth?.value) return redirect("/");
    const user = await getUserByToken(auth?.value);
    if (!user) return redirect("/");
    if (!user.is_manager) return redirect("/");

    const { id } = params;
    const client = await getClient(id);
    return <>
        <h1>Редактирование клиента #{id}</h1>
        <EditClientForm clientData={client} />
    </>
}

async function getClient(clientId: number): Promise<ClientInterface> {
    const clients: ClientInterface[] = await new Promise(r => {
        pool.query(
            `SELECT * FROM clients WHERE id = ${clientId}`,
            function (err: any, res: ClientInterface[]) {
                if (err) {
                    sendMessageToTg(
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