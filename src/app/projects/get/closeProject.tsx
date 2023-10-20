"use client"

import { toast } from "react-toastify";

export default function CloseProject({ project_id }: { project_id: number }) {
    return <><button
        className="btn btn-sm btn-outline-danger text-nowrap"
        onClick={() => {
            fetch(
                `/api/projects/close/${project_id}`,
                {
                    method: "POST"
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
                    toast.success("Задача закрыта");
                    // resetForm();
                } else {
                    toast.error("Что-то пошло не так");
                }
            })
                .catch(error => {
                    toast.error("Что-то пошло не так");
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
                                    err: "#nfhHyT3",
                                    data: {
                                        statusText,
                                        values: { project_id }
                                    }
                                }
                            })
                        }
                    )
                        .then(x => x.json())
                })
        }}
    >Закрыть задачу</button></>
}

