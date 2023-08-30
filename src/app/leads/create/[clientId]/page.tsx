import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { ClientInterface } from "@/app/clients/get/page";
import { pool } from "@/app/db/connect";
import CreateLeadForm from "./createLeadForm";
import { getUserByToken } from "@/app/components/getUserByToken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { clientId: number } }) {
    const auth = cookies().get('auth');
    if (!auth?.value) return redirect("/");
    const user = await getUserByToken(auth?.value);
    if (!user) return redirect("/");
    if (!user.is_manager) return redirect("/");

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
            "SELECT * FROM clients WHERE id = ?  ORDER BY id DESC",
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
