"use client"
import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import MessageForm from "./messageForm"
import { ProjectInterface } from "@/app/components/types/projects"
import ProjectCloser from "./projectCloser"

export default function Client(props: {
    project: ProjectInterface
}) {

    const [project, setCombinedPurchaseTaskData] = useState(props.project)

    useEffect(() => {
        let mounted = true;
        (async function refresh() {
            if (!mounted) return;
            await new Promise(r => setTimeout(() => {
                r(1)
            }, 2000));
            const newProject = await fetchProject(props.project.id);
            if (JSON.stringify(project) !== JSON.stringify(newProject)) setCombinedPurchaseTaskData(newProject);
            setTimeout(() => {
                refresh();
            }, 2000);
        })()
        return () => { mounted = false; }
    }, []);

    return <>
        <h1>Проект #{project.id}</h1>
        {!project.done_at && <div className="mb-3">
            <ProjectCloser task_id={project.id} />
        </div>}
        <>
            <table className="table table-bordered w-auto">
                <tbody>
                    <tr><td>Заголовок</td><td>{project.title}</td></tr>
                    <tr><td>Описание</td><td>{project.comment}</td></tr>
                    <tr><td>Дедлайн</td><td>{dayjs(project.deadline).format("DD.MM.YYYY")}</td></tr>
                    <tr><td>Дата создания</td><td>{dayjs(project.created_date).format("DD.MM.YYYY")}</td></tr>
                    <tr><td>Дата выполнения</td><td>{project.done_at ? dayjs(project.done_at).format("DD.MM.YYYY") : "-"}</td></tr>
                </tbody>
            </table>
            <div className="card mt-3">
                <div className="card-header"><div className="h3">Закупки</div></div>
                <MessageForm project_id={project.id} />
            </div>

        </>
    </>
}

async function fetchProject(project_id: number) {
    return await fetch(
        `/api/projects/get/${project_id}`,
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
            if (data.project) {
                return data.project;
            } else {
                toast.error("Что-то пошло не так #cnfDckd3n");
            }
        } else {
            toast.error("Что-то пошло не так #cjdhy7");
        }
    })
        .catch(_ => {
            toast.error("Что-то пошло не так #nvjHhgG");
        });
}