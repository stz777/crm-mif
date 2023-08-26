"use client"
import { PurchaseTaskInterface } from "@/app/components/types/purchaseTask"
import { useEffect, useState } from "react"
import dayjs from "dayjs";
import Link from "next/link";
import TaskCloser from "../single/[task_id]/taskCloser";
import { RightsManagement } from "./righsManagement/rightsManagement";
import { toast } from "react-toastify";

export default function Client(props: { purchaseTasks: PurchaseTaskInterface[]; is_boss: boolean, searchParams: {} }) {
    const [purchaseTasks, setPurchaseTasks] = useState(props.purchaseTasks);
    useEffect(() => {
        let mount = true;
        (async function refreshData() {
            if (!mount) return;
            await new Promise(resolve => { setTimeout(() => { resolve(1); }, 1000); });
            const response = await fetchGetPurchaseTasks(props.searchParams);
            if (JSON.stringify(response.purchasingTasks) !== JSON.stringify(purchaseTasks)) setPurchaseTasks(response.purchasingTasks);
            await refreshData();
        })();
        return () => { mount = false; }
    }, [purchaseTasks])
    return <>
        <h1>Список задач-закупок</h1>
        <table className="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>номер</th>
                    {/* <th>заголовок</th> */}
                    <th>описание</th>
                    <th>дата создания</th>
                    <th>дедлайн</th>
                    <th>статус</th>
                    <th>дата выполнения</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {purchaseTasks.map(task => <tr key={task.id}>
                    <td className="text-nowrap"><Link href={`/purchasing_tasks/single/${task.id}`}>Задача #{task.id}</Link></td>
                    <td>{task.comment}</td>
                    <td>{dayjs(task.created_date).format("DD.MM.YYYY")}</td>
                    <td>{dayjs(task.deadline).format("DD.MM.YYYY")}</td>
                    <td>{(() => {
                        const date1 = dayjs(task.deadline).set("hour", 0).set("minute", 0);
                        const date2 = dayjs(task.created_date).set("hour", 0).set("minute", 0);
                        const diffInDays = date1.diff(date2, 'day');
                        const limit = 1;
                        if (task.done_at) return <span className="badge text-bg-success">выполнено</span>
                        if (diffInDays <= limit) return <span className="badge text-bg-danger">срочно</span>
                        if (diffInDays > limit) return <span className="badge text-bg-warning">в работе</span>
                        return <>{diffInDays}</>
                    })()}</td>
                    <td>{task.done_at ? dayjs(task.done_at).format("DD.MM.YYYY") : "-"}</td>
                    <td>
                        <div className="d-flex nowrap">
                            {(() => {
                                if (task.done_at) return <>Задача закрыта</>
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

async function fetchGetPurchaseTasks(searchParams: any) {
    return fetch(
        "/api/purchasing_tasks/get",
        {
            method: "POST",
            body: JSON.stringify({ searchParams })
        }
    ).then(
        response => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error(response.statusText);
            }
        }
    ).then(data => {
        if (data.success) {
            if (!data.purchasingTasks) {
                toast.error("Что-то пошло не так #dndyYt6");
            }
            return data;
        } else {
            toast.error("Что-то пошло не так #dmnHg38");
        }
    })
        .catch(error => {
            const statusText = String(error);
            fetch(
                `/api/bugReport`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        text: {
                            err: "#dnsdcds8",
                            data: {
                                statusText,
                                values: {}
                            }
                        }
                    })
                }
            )
                .then(x => x.json())
        })
}