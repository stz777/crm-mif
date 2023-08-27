"use client"
import { toast } from "react-toastify";

export default function ProjectCloser(props: { task_id: number }) {
    return <>
        <button className="btn btn-sm btn-outline-danger" onClick={() => { fetchCloseProject(props.task_id) }}>
            Закрыть проект {props.task_id}
        </button>
    </>
}

async function fetchCloseProject(project_id: number) {
    fetch(`/api/projects/close/${project_id}`, {
        method: "POST"
    })
        .then(
            response => {
                if (response.ok) {
                    return response.json()
                } else {
                    throw new Error(response.statusText);
                }
            }
        )
        .then(data => {
            if (data.success) {
                toast.success("Проект закрыт");
            } else {
                toast.error("Что-то пошло не так");
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
                            err: "#jdhfUyr",
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