import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { PurchaseTaskInterface } from "@/app/components/types/purchaseTask";
import { pool } from "@/app/db/connect";
import dayjs from "dayjs";
import CreatePurschaseForm from "./createPurchaseForm";
import { PurchaseInterface } from "@/app/components/types/purchase";

export default async function Page({ params }: { params: { task_id: number } }) {
    const { task_id } = params;
    const task = await getPurchaseTaskById(task_id);

    const purchases = await getPurchasesByTaskId(task_id);

    return <>
        <h1>Задача-закупка #{task_id}</h1>
        <>
            <table className="table table-bordered w-auto">
                <tbody>
                    <tr><td>Заголовок</td><td>{task.title}</td></tr>
                    <tr><td>Описание</td><td>{task.comment}</td></tr>
                    <tr><td>Дедлайн</td><td>{dayjs(task.deadline).format("DD.MM.YYYY")}</td></tr>
                    <tr><td>Дата создания</td><td>{dayjs(task.created_date).format("DD.MM.YYYY")}</td></tr>
                    <tr><td>Дата выполнения</td><td>{task.done_at ? dayjs(task.done_at).format("DD.MM.YYYY") : "-"}</td></tr>
                </tbody>
            </table>
            <CreatePurschaseForm task_id={task.id} />

            <div className="card mt-3">
                <div className="card-header"><div className="h3">Закупки</div></div>
                <div className="card-body">
                    {purchases.length ? <table className="table table-bordered w-auto">
                        <thead>
                            <tr>
                                <td>номер</td>
                                <td>дата</td>
                                <td>сумма</td>
                                <td>комментарий</td>
                                <td>цель</td>
                            </tr>
                        </thead>
                        <tbody>
                            {purchases.map(purchase => <tr key={purchase.id}>
                                <td>{purchase.id}</td>
                                <td className="text-nowrap">{dayjs(purchase.created_date).format("DD.MM.YYYY HH:mm")}</td>
                                <td>{purchase.sum}</td>
                                <td>{purchase.comment}</td>
                                <td>{purchase.material_name} (#{purchase.materials})</td>
                            </tr>)}
                        </tbody>
                    </table> : <>нет закупок</>}
                </div>
            </div>
        </>
    </>
}

export async function getPurchaseTaskById(task_id: number): Promise<PurchaseTaskInterface> {
    return await new Promise(r => {
        pool.query(`SELECT 
            * FROM 
            purchasing_tasks WHERE id = ?`,
            [task_id],
            function (err: any, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#dmdk4ndnN",
                                error: err,
                                values: { task_id }
                            }, null, 2),
                        "5050441344"
                    )
                }
                r(res?.pop());
            })
    });
}

export async function getPurchasesByTaskId(task_id: number): Promise<PurchaseInterface[]> {
    return await new Promise(r => {
        pool.query(`SELECT expenses_per_purchase_task.*, materials.name as material_name
        FROM expenses_per_purchase_task
        INNER JOIN materials
        ON materials.id = expenses_per_purchase_task.materials
        WHERE expenses_per_purchase_task.purchase_task = ?
        `,
            // pool.query("SELECT * FROM expenses_per_purchase_task WHERE id = ?",
            [task_id],
            function (err: any, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#djsmcs4ms",
                                error: err,
                                values: { task_id }
                            }, null, 2),
                        "5050441344"
                    )
                }
                r(res ? res : []);
            })
    });
}
