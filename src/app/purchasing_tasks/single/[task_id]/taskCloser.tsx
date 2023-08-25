"use client"

import { toast } from "react-toastify";

export default function TaskCloser(props: { task_id: number }) {
    return <>
        <button className="btn btn-btn-sm btn-outline-danger"
            onClick={() => {
                fetchClosePurchaseTask(props.task_id)
            }}
        >
            Закрыть задачу {props.task_id}
        </button>
    </>
}

async function fetchClosePurchaseTask(purchaseTaskId: number) {
    fetch(`/api/purchasing_tasks/close/${purchaseTaskId}`, {
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
        ).then(data => {
            if (data.success) {
                toast.success("Сотрудник создан");
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
                            err: "#adcmck883jm",
                            data: {
                                statusText,
                                values: {}
                            }
                        }
                    })
                }
            )
                .then(x => x.json())
                .then(x => {
                    console.log(x);
                })
        })
}