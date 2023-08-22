import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { PurchaseTaskInterface } from "@/app/components/types/purchaseTask";
import { pool } from "@/app/db/connect";
import dayjs from "dayjs";
import Link from "next/link";

export default async function Page() {
    const purchaseTasks = await getPurschaseTaskFn();
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
                </tr>)}
            </tbody>
        </table>
    </>
}

async function getPurschaseTaskFn(): Promise<PurchaseTaskInterface[]> {
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

