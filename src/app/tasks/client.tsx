"use client"

import { TaskFromDBInterface } from "@/types/tasks/task";
import CreateTaskForm from "./CreateTaskForm";
import dayjs from "dayjs";
import Filter from "./filter";
import { SearchInterface } from "./types";

export default function Client(props: { tasks: TaskFromDBInterface[], searchParams: SearchInterface }) {
    return <>
        <div className="d-flex">
            <div>
                <CreateTaskForm />
            </div>
            <div>
                <Filter searchParams={props.searchParams} />
            </div>
        </div>
        <table className="table w-100">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Описание</th>
                    <th>Ответственный</th>
                    <th>Дата создания</th>
                    <th>Дедлайн</th>
                </tr>
            </thead>
            <tbody>
                {props.tasks.map(task => <tr key={task.id}>
                    <td>{task.id}</td>
                    <td>{task.description}</td>
                    <td>{task.managerName}</td>
                    <td>{dayjs(task.created_date).format("DD.MM.YYYY")}</td>
                    <td>
                        {dayjs(task.deadline).format("DD.MM.YYYY")}
                        <div className="mt-2"><TaskStatus deadline={task.deadline} /></div>
                    </td>
                </tr>)}
            </tbody>
        </table>
    </>
}

function TaskStatus(props: { deadline: any }) {
    let isLate = dayjs().isAfter(props.deadline);
    return <div>
        <div className={isLate ? "d-inline bg-danger p-1" : "d-inline bg-warning p-1"}>
            {isLate ? "Просрочено" : "В работе"}
        </div>
    </div>
}