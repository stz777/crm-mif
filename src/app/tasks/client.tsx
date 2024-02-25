"use client"

import { TaskFromDBInterface } from "@/types/tasks/task";
import CreateTaskForm from "./CreateTaskForm";
import dayjs from "dayjs";
import Filter from "./filter";
import { SearchInterface } from "./types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

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

function TaskStatus(props: { deadline: any }) {
    let isLate = dayjs().isAfter(props.deadline);
    return <div>
        <div className={isLate ? "d-inline bg-danger p-1" : "d-inline bg-warning p-1"}>
            {isLate ? "Просрочено" : "В работе"}
        </div>
    </div>
}

async function fetchGetTaskData(searchParams: SearchInterface) {
    return await fetch(
        `/api/tasks/get`,
        {
            method: "POST",
            body: JSON.stringify(searchParams)
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
            return data.tasks;
        } else {
            toast.error("Что-то пошло не так #dmcds8s");
        }
    })
        .catch(_ => {
            toast.error("Что-то пошло не так #chd8y3");
        });
}