"use client"

import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { toast } from "react-toastify"

type Inputs = {
    lead_id: number
    sum: number
}

export function Add_Payment(props: { lead_id: number }) {
    const [isOPen, setIsOpen] = useState(false);
    const { register, handleSubmit, reset }: any = useForm<Inputs>({
        defaultValues: {
            lead_id: props.lead_id
        }
    })
    return <>
        {isOPen ? <div className="card">
            <div className="card-header">
                <div className="card-title">Добавить оплату</div>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit((e: any) => onSubmit(e, reset))} className="mb-2">
                    <input {...register("sum")} type="number" className="form-control" />
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
            }}>Добавить оплату</button>}

    </>
}

const onSubmit: SubmitHandler<Inputs> = (data, resetForm: any) => {
    fetch(
        "/api/payments/create",
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
            toast.success("Платеж проведен");
            resetForm();
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
                            err: "#admccKk3jm",
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
    console.log(data)
}