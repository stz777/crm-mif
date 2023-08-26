import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { PurchaseTaskInterface } from "@/app/components/types/purchaseTask";
import { pool } from "@/app/db/connect";

import Client from "./client";
import { getUserByToken } from "@/app/components/getUserByToken";
import { getLeads } from "@/app/leads/get/getLeadsFn";
import { cookies } from "next/headers";

export default async function Page(props: any) {
    const { searchParams } = props;
    const purchaseTasks = await getPurschaseTaskFn(searchParams);
    const auth = cookies().get('auth');
    const user = await getUserByToken(String(auth?.value));
    const leads = await getLeads(searchParams);
    const is_boss = [1, 2].includes(Number(user?.id)); //FIXME сделать нормальную проверку на босса

    return <Client purchaseTasks={purchaseTasks} is_boss={is_boss} searchParams={searchParams} />
}

export async function getPurschaseTaskFn(searchParams:{}): Promise<PurchaseTaskInterface[]> { //вынести куда-нибудь функции, получающие функции, по вложенности путаница получается
    return await new Promise(resolve => {
        pool.query(
            "SELECT * FROM purchasing_tasks",
            function (err: any, res: PurchaseTaskInterface[]) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#dnNdc8sS00",
                                error: err,
                                values: {}
                            }, null, 2),
                        "5050441344"
                    )
                }
                resolve(res ? res : []);
            }
        )
    })
}

