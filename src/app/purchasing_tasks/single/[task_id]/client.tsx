"use client"
import { PurchaseInterface } from "@/app/components/types/purchase"
import { PurchaseTaskInterface } from "@/app/components/types/purchaseTask"
import TaskCloser from "./taskCloser"
import dayjs from "dayjs"
import CreatePurschaseForm from "./createPurchaseForm"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import MessageForm from "./messageForm"
import { MaterialInterface } from "@/types/materials/materialInterface"
import roleTranslator from "@/app/components/translate/roleTranslator"
import { EmployeeToPurchaseTaskInterface } from "@/types/employees/employeeToPurchaseTaskInterface"
import { RightsManagement } from "../../get/righsManagement/rightsManagement"
import Chat from "@/app/components/chat/chat"
import { messageToPurchaseTakInterface } from "@/types/messages/messageToPurchaseTakInterface"

export default function Client(props: {
    combinedPurchaseTaskData: {
        task: PurchaseTaskInterface
        purchases: PurchaseInterface[]
    },
    materials: MaterialInterface[]
    employees: EmployeeToPurchaseTaskInterface[]
    messages: messageToPurchaseTakInterface[]
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


        <div className="container-fluid">
            <div className="row">
                <div className="col">
                    <div className="card">
                        <div className="card-header"><h3>Детали задачи</h3></div>
                        <div className="card-body">
                            <table className="table table-bordered w-auto">
                                <tbody>
                                    <tr><td>Заголовок</td><td>{task.title}</td></tr>
                                    <tr><td>Описание</td><td>{task.comment}</td></tr>
                                    <tr><td>Дедлайн</td><td>{dayjs(task.deadline).format("DD.MM.YYYY")}</td></tr>
                                    <tr><td>Дата создания</td><td>{dayjs(task.created_date).format("DD.MM.YYYY")}</td></tr>
                                    <tr><td>Дата выполнения</td><td>{task.done_at ? dayjs(task.done_at).format("DD.MM.YYYY") : "-"}</td></tr>
                                    <tr><td>Ответственные</td><td>
                                        {!props.employees ? null : <table className='table'>
                                            <tbody>
                                                {props.employees.map(employee => <tr key={employee.id}>
                                                    <td>{employee.username}</td>
                                                    <td>{roleTranslator[employee.role]}</td>
                                                </tr>)}
                                            </tbody>
                                        </table>}
                                    </td></tr>
                                    <tr><td>Ответственные</td><td>
                                        <RightsManagement
                                            task_id={task.id}
                                        />
                                    </td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="col">
                    <div className="card">
                        <div className="card-header"><h3>Закупки</h3></div>
                        <div className="card-body">
                            {!task.done_at && <CreatePurschaseForm task_id={task.id} materials={props.materials} />}
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
                    </div>
                </div>

            </div>
        </div>

        <>


            <div className="card">
                <div className="card-header"><div className="h3">Чат</div></div>
                <div className="card-body">
                    <MessageForm task_id={task.id} />
                    <Chat messages={props.messages} essense_type="purchase_task" essense_id={task_id} />
                </div>

            </div>
        </>
    </>
}

async function fetchGetTaskData(task_id: number) {
    return await fetch(
        `/api/purchasing_tasks/get/${task_id}`,
        {
            method: "POST",
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
            toast.error("Что-то пошло не так #dmcddazs8s");
        }
    })
        .catch(_ => {
            toast.error("Что-то пошло не так #chd8sy3");
        });
}