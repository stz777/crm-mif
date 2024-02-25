"use client"
import { TaskFromDBInterface } from "@/types/tasks/task";
import CreateTaskForm from "./CreateTaskForm";
import dayjs from "dayjs";
import Filter from "./filter";
import { SearchInterface } from "./types";
import { useEffect, useState } from "react";
import fetchGetTaskData from "./fetchGetTaskData";
import TaskStatus from "./TaskStatus";

export default function Client(props: { tasks: TaskFromDBInterface[], searchParams: SearchInterface }) {

    const [tasks, setTasks] = useState(props.tasks);

    useEffect(() => {
        let mounted = true;
        (async function refresh() {
            if (!mounted) return;
            await new Promise(r => setTimeout(() => {
                r(1)
            }, 2000));
            const newTaskData = await fetchGetTaskData(props.searchParams);
            if (JSON.stringify(newTaskData) !== JSON.stringify(tasks)) setTasks(newTaskData);
            setTimeout(() => {
                refresh();
            }, 2000);
        })()
        return () => { mounted = false; }
    }, []);

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