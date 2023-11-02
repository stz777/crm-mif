"use client"

import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { toast } from "react-toastify"

type Inputs = {
    lead_id: number
    sum: number
    comment: string
}

export function AddExpense(props: { lead_id: number }) {
    const [isOPen, setIsOpen] = useState(false);
    const { register, handleSubmit, reset }: any = useForm<Inputs>({
        defaultValues: {
            lead_id: props.lead_id
        }
    })
    return <>
        {isOPen ? <div className="card">
            <div className="card-header">
                <div className="card-title">Добавить расход</div>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit((e: any) => onSubmit(e, reset, () => setIsOpen(false)))} className="mb-2">
                    <input {...register("sum")} className="form-control" placeholder="сумма" />
                    <textarea {...register("comment")} className="form-control" placeholder="коммент" />
                    <div className="d-flex mt-2">
                        <button className="btn btn-sm btn-outline-dark me-2">Провести</button>
                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => {
                                setIsOpen(false);
                            }}>отмена</button>
                    </div>
                </form>
            </div>
        </div> : <button
            className="btn btn-sm btn-outline-dark text-nowrap"
            onClick={() => {
                setIsOpen(true);
            }}>Добавить расход</button>}
    </>
}

const onSubmit = (data: any, resetForm: any, close: any) => {
    fetch(
        "/api/expenses_per_lead/create",
        {
            method: "POST",
            body: JSON.stringify(data)
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
            toast.success("Расход сохранен");
            resetForm();
            close();
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
                            err: "#adcmck3jm",
                            data: {
                                statusText,
                                values: data
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