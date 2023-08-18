import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { ClientInterface } from "@/app/clients/get/page";
import { pool } from "@/app/db/connect";
import CreateLeadForm from "./createLeadForm";

export default async function Page({ params }: { params: { clientId: number } }) {
    const [client] = await getClient(params.clientId);
    return <>
        <h1>Создать заказ</h1>
        <div className="mb-3">Клиент: <strong>{client.full_name}</strong></div>
        {/* {JSON.stringify({ params })} */}
        <CreateLeadForm clientId={params.clientId} />
    </>
}


async function getClient(clientId: number): Promise<ClientInterface[]> {
    return await new Promise(r => {
        pool.query(
            "SELECT * FROM clients WHERE id = ?",
            [clientId],
            function (err: any, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#cmdn3n5b",
                                error: err,
                                values: {}
                            }, null, 2),
                        "5050441344"
                    )
                }
                r(res);
            })
    });
}
