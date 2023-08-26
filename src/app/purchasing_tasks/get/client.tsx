"use client"

import { PurchaseTaskInterface } from "@/app/components/types/purchaseTask"
import { useState } from "react"
import dayjs from "dayjs";
import Link from "next/link";
import TaskCloser from "../single/[task_id]/taskCloser";
import { RightsManagement } from "./righsManagement/rightsManagement";

export default function Client(props: { purchaseTasks: PurchaseTaskInterface[]; is_boss: boolean }) {
    const [purchaseTasks, setPurchaseTasks] = useState(props.purchaseTasks)
    return <>
        <h1>Список задач-закупок</h1>
        <table className="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>номер</th>
                    <th>заголовок</th>
                    <th>описание</th>
                    <th>дата создания</th>
                    <th>дедлайн</th>
                    <th>дата выполнения</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {purchaseTasks.map(task => <tr key={task.id}>
                    <td><Link href={`/purchasing_tasks/single/${task.id}`}>Задача #{task.id}</Link></td>
                    <td>{task.title}</td>
                    <td>{task.comment}</td>
                    <td>{dayjs(task.created_date).format("DD.MM.YYYY")}</td>
                    <td>{dayjs(task.deadline).format("DD.MM.YYYY")}</td>
                    <td>{task.done_at ? dayjs(task.done_at).format("DD.MM.YYYY") : "-"}</td>
                    <td>
                        <div className="d-flex nowrap">
                            {(() => {
                                if (task.done_at) return <>Заказ закрыт</>
                                if (props.is_boss) return <TaskCloser task_id={task.id} />
                                return <>В работе</>
                            })()}
                            {props.is_boss && <div className="ms-2"><RightsManagement task_id={task.id} /></div>}
                        </div>
                    </td>
                </tr>)}
            </tbody>
        </table>
    </>
}