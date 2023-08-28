import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { PurchaseTaskInterface } from "@/app/components/types/purchaseTask";
import { pool } from "@/app/db/connect";
import Client from "./client";
import { getUserByToken } from "@/app/components/getUserByToken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page(props: any) {
    const auth = cookies().get('auth');
    if (!auth?.value) return redirect("/");
    const user = await getUserByToken(auth?.value);
    if (!user) return redirect("/");
    if (!user.is_manager) return redirect("/");

    const { searchParams } = props;
    const purchaseTasks = await getPurschaseTaskFn(searchParams);
    const is_boss = [1, 2].includes(Number(user?.id)); //FIXME сделать нормальную проверку на босса
    return <Client purchaseTasks={purchaseTasks} is_boss={is_boss} searchParams={searchParams} />
}

export async function getPurschaseTaskFn(searchParams: any): Promise<PurchaseTaskInterface[]> { //вынести куда-нибудь функции, получающие функции, по вложенности путаница получается

    const searchStrings: string[] = [];

    if (searchParams.id) {
        searchStrings.push(`id = ${searchParams.id}`)
    }
    if (searchParams.is_archive === "true") {
        searchStrings.push(`done_at IS NOT NULL`)
    } else {
        searchStrings.push(`done_at IS NULL`)
    }
    const whereString = searchStrings.length ? `WHERE ${searchStrings.join(" AND ")}` : "";
    return await new Promise(resolve => {
        pool.query(
            `SELECT * FROM purchasing_tasks ${whereString}`,
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

