"use client"
import { PurchaseInterface } from "@/app/components/types/purchase"
import { PurchaseTaskInterface } from "@/app/components/types/purchaseTask"
import TaskCloser from "./taskCloser"
import dayjs from "dayjs"
import CreatePurschaseForm from "./createPurchaseForm"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Chat from "@/app/leads/single/[id]/chat"

export default function Client(props: {
    combinedPurchaseTaskData: {
        task: PurchaseTaskInterface
        purchases: PurchaseInterface[]
    }
}) {

    const [combinedPurchaseTaskData, setCombinedPurchaseTaskData] = useState(props.combinedPurchaseTaskData)

    useEffect(() => {
        let mounted = true;
        (async function refresh() {
            if (!mounted) return;
            await new Promise(r => setTimeout(() => {
                r(1)
            }, 2000));
            const newTaskData = await fetchGetTaskData(task.id);
            if (JSON.stringify(newTaskData) !== JSON.stringify(combinedPurchaseTaskData)) setCombinedPurchaseTaskData(newTaskData);
            setTimeout(() => {
                refresh();
            }, 2000);
        })()
        return () => { mounted = false; }
    }, []);

    const { task, purchases, } = combinedPurchaseTaskData;
    const { id: task_id } = task;

    return <>
        <h1>Задача-закупка #{task_id}</h1>
        {!task.done_at && <div className="mb-3">
            <TaskCloser task_id={task_id} />
        </div>}
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
            {!task.done_at && <CreatePurschaseForm task_id={task.id} />}

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
                                <td className="text-nowrap">{dayjs(purchase.created_date).format("DD.MM.YYYY")}</td>
                                <td>{purchase.sum}</td>
                                <td>{purchase.comment}</td>
                                <td>{purchase.material_name} (арт. {purchase.materials})</td>
                            </tr>)}
                        </tbody>
                    </table> : <>нет закупок</>}
                </div>
                {/* <Chat /> */}
            </div>
        </>
    </>
}

async function fetchGetTaskData(task_id: number) {
    return await fetch(
        `/api/purchasing_tasks/get/${task_id}`,
        {
            method: "GET",
        }
    ).then(
        response => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error(response.statusText);
            }
        }
    ).then((data: any) => {
        if (data.success) {
            if (data.purchaseTaskData) {
                return data.purchaseTaskData;
            } else {
                toast.error("Что-то пошло не так #cndsd3n");
            }
        } else {
            toast.error("Что-то пошло не так #dmcds8s");
        }
    })
        .catch(_ => {
            toast.error("Что-то пошло не так #chd8sy3");
        });
}