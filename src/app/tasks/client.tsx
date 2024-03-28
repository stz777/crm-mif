"use client"
import { TaskFromDBInterface } from "@/types/tasks/task";
import CreateTaskForm from "./CreateTaskForm";
import dayjs from "dayjs";
import Filter from "./filter";
import { SearchInterface } from "./types";
import { JSXElementConstructor, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import fetchGetTaskData from "./fetchGetTaskData";
import TaskStatus from "./TaskStatus";
import querystring from "querystring";
import SideModal from "@/components/SideModal/SideModal";
import { toast } from "react-toastify";
import CommentEditor from "./CommentEditor";

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
    }, [props]);

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
                    <th>Комментарий</th>
                    <th>Ответственный</th>
                    <th>Дата создания</th>
                    <th>Дедлайн</th>
                    {props.searchParams.is_archive && <th>Дата завершения</th>}
                </tr>
            </thead>
            <tbody>
                {tasks.map(task => <TaskTr task={task} key={task.id}>
                    <td>{task.id}</td>
                    <td>{task.description}</td>
                    <td>{task.comment}</td>
                    <td>{task.managerName}</td>
                    <td>{dayjs(task.created_date).format("DD.MM.YYYY")}</td>
                    <td>
                        {dayjs(task.deadline).format("DD.MM.YYYY")}
                        {!props.searchParams.is_archive && <div className="mt-2"><TaskStatus deadline={task.deadline} done_at={task.done_at} /></div>}
                    </td>
                    {props.searchParams.is_archive && <td>{dayjs(task.done_at).format("DD.MM.YYYY")}</td>}
                </TaskTr>)}
            </tbody>
        </table>
    </>
}


function TaskTr(props: {
    task: TaskFromDBInterface,
    children: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined;
}) {
    const [is_open, setIsOpen] = useState(false);
    return <>
        <tr onClick={() => {
            setIsOpen(true);
        }}>
            {props.children}
        </tr>
        <SideModal isOpen={is_open} closeHandle={() => setIsOpen(false)}>
            <>
                <TaskDetails task={props.task} />
            </>
        </SideModal>
    </>
}

function TaskDetails(props: { task: TaskFromDBInterface }) {
    return <>
        <div className="d-flex align-items-center border-bottom px-4 py-3 ">
            <div className="h3">Детали задачи</div>
            <span className="ms-3 text-secondary" style={{ fontSize: "0.9em" }}>ID: {props.task.id}</span>
        </div>
        <div className="px-4">
            <div><Wrapper title="Описание">{props.task.description}</Wrapper></div>
            <div><Wrapper title="Комментарий"> <CommentEditor comment={props.task.comment} taskId={props.task.id} /> {/*props.task.comment*/}</Wrapper></div>
            <div><Wrapper title="Ответственный">{props.task.managerName}</Wrapper></div>
            <div><Wrapper title="Дата создания">{dayjs(props.task.created_date).format("DD.MM.YYYY")}</Wrapper></div>
            <div><Wrapper title="Дата создания">
                {dayjs(props.task.deadline).format("DD.MM.YYYY")}
            </Wrapper></div>
            <div><Wrapper title="Статус выполнения">
                <div className="mt-2"><TaskStatus deadline={props.task.deadline} done_at={props.task.done_at} /></div>
            </Wrapper></div>
            <div><Wrapper title="">
                {props.task.done_at ? dayjs(props.task.created_date).format("DD.MM.YYYY") :
                    <button onClick={() => closeTask(props.task.id)} className="btn btn-outline-dark">Завершить задачу</button>
                }
            </Wrapper></div>
        </div>
    </>
}

async function closeTask(taskId: number) {
    toast(taskId);
    fetch(`/api/tasks/close/${taskId}`, { method: "post" })
}

function Wrapper(props: {
    title: string;
    children: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined;
}) {
    return <>
        <div className="d-flex mb-3">
            <div style={{ width: 220 }}>{props.title}</div>
            <div>{props.children}</div>
        </div>
    </>
}
