"use client"
import { TaskFromDBInterface } from "@/types/tasks/task";
import CreateTaskForm from "./CreateTaskForm";
import dayjs from "dayjs";
import Filter from "./filter";
import { SearchInterface } from "./types";
import { useEffect, useState } from "react";
import fetchGetTaskData from "./fetchGetTaskData";
import TaskStatus from "./TaskStatus";
import querystring from "querystring";

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
        <div className="d-flex justify-content-between">
            <div className="d-flex">
                <CreateTaskForm />
                <Filter searchParams={props.searchParams} />
            </div>
            <div>
                <button
                    onClick={() => {
                        if (props.searchParams.is_archive) {
                            delete props.searchParams.is_archive;
                        } else {
                            props.searchParams.is_archive = "true";
                        }
                        const { pathname, origin } = window.location;
                        const qs = querystring.encode(((): any => props.searchParams)());
                        // const linkParts = [pathname, `?${qs}`];
                        const link = `${origin}/${pathname}?${qs}`;
                        window.location.href = link
                    }}
                    className="btn btn-outline-dark float-left"
                >
                    {props.searchParams.is_archive ? "скрыть" : "показать"} архив
                </button>
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