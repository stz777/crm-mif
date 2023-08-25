import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { PurchaseTaskInterface } from "@/app/components/types/purchaseTask";
import { pool } from "@/app/db/connect";
import dayjs from "dayjs";
import CreatePurschaseForm from "./createPurchaseForm";
import { PurchaseInterface } from "@/app/components/types/purchase";
import { getPurchaseTaskById } from "./getPurchaseTaskById";
import { getPurchasesByTaskId } from "./getPurchasesByTaskId";

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
                                <td>{purchase.material_name} (арт. {purchase.materials})</td>
                            </tr>)}
                        </tbody>
                    </table> : <>нет закупок</>}
                </div>
            </div>
        </>
    </>
}

