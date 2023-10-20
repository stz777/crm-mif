"use client"
import Link from "next/link";
import CloseProject from "./closeProject";
import dayjs from 'dayjs'
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ProjectInterface } from "@/app/components/types/projects";
import { RightsManagement } from "./righsManagement/rightsManagement";

export default function Client(props: { projects: ProjectInterface[], is_manager: boolean, is_boss: boolean, searchParams: any }) {
    const [projects, setProjects] = useState(props.projects);

    useEffect(() => {
        let mount = true;
        (async function refreshData() {
            if (!mount) return;
            await new Promise(resolve => { setTimeout(() => { resolve(1); }, 1000); });
            const response = await fetchProjects(props.searchParams);
            if (JSON.stringify(projects) !== JSON.stringify(response.projects)) {
                setProjects(response.projects);
            }
            await refreshData();
        })();
        return () => { mount = false; }
    }, [projects])

    return <>
       

        {projects ? <table className="table table-bordered">
            <thead>
                <tr>
                    <th>Ссылка</th>
                    <th>Заголовок</th>
                    <th>описание</th>
                    <th>создан</th>
                    <th>дедлайн</th>
                    <th>срочность</th>
                    <th>дата факт. выполнения</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {projects.map(project => <tr key={project.id}>
                    <td><Link href={`/projects/single/${project.id}`} className="text-nowrap">Задача #{project.id}</Link></td> {/*project id*/}
                    <td>{project.title}</td>{/*client id*/}
                    <td>{project.comment}</td>{/*description*/}
                    <td>{dayjs(project.created_date).format("DD.MM.YYYY")}</td>{/*created_date*/}
                    <td>{dayjs(project.deadline).format("DD.MM.YYYY")}</td>{/*deadline*/}
                    <td>{(() => {
                        const date1 = dayjs(project.deadline).set("hour", 0).set("minute", 0).add(1, "hours");;
                        const date2 = dayjs(project.created_date).set("hour", 0).set("minute", 0);
                        const diffInDays = date1.diff(date2, 'day');
                        const limit = 1;
                        if (project.done_at) return <span className="badge text-bg-success">выполнено</span>
                        if (diffInDays <= limit) return <span className="badge text-bg-danger">срочно</span>
                        if (diffInDays > limit) return <span className="badge text-bg-warning">в работе</span>
                        return <>{diffInDays}</>
                    })()}</td>

                    <td>
                        <span className="text-nowrap">{project.done_at ? dayjs(project.done_at).format("DD.MM.YYYY HH:mm") : "-"}</span>
                    </td>{/*дата выполнения*/}
                    <td>
                        <div className="d-flex nowrap">
                            {(() => {
                                if (project.done_at) return <>Задача закрыта</>
                                if (props.is_boss) return <CloseProject project_id={project.id} />
                                return <>В работе</>
                            })()}
                            {props.is_boss && <div className="ms-2"><RightsManagement project_id={project.id} /></div>}
                        </div>
                    </td>
                </tr>)}
            </tbody>
        </table> : <>нет проектов...</>}
    </>
}

async function fetchProjects(searchParams: any) {
    return fetch(
        "/api/projects/get",
        {
            method: "POST",
            body: JSON.stringify({searchParams})
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
            if (!data.projects) {
                toast.error("Что-то пошло не так #dmJjsd3J");
            }
            return data;
        } else {
            toast.error("Что-то пошло не так #mdnasdj3");
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
                            err: "#dnsdncds8",
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