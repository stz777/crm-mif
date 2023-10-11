"use client"

import FieldWrapper from "@/app/ui/form/fieldWrapper"
import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { toast } from "react-toastify"

type Inputs = {
    lead_id: number
    sum: number
}

export function Add_Payment(props: { lead_id: number, is_boss?: boolean }) {
    const [isOPen, setIsOpen] = useState(false);
    const { register, handleSubmit, reset }: any = useForm<Inputs>({
        defaultValues: {
            lead_id: props.lead_id
        }
    })
    return <>
        {isOPen ? <div className="card">
            <div className="card-header">
                <div className="card-title">Добавить оплату </div>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit((e: any) => onSubmit(e, reset, props.is_boss))} className="mb-2">
                    <FieldWrapper
                        title="Сумма"
                        field={<>
                            <input {...register("sum", { required: true })} type="number" className="form-control" />
                        </>}
                    />
                    <FieldWrapper
                        title="Изображение"
                        field={<>
                            <input type="file" {...register("image"/* , { required: true } */)}
                            />
                        </>}
                    />
                    <div className="d-flex mt-2">
                        <div>
                            <button className="btn btn-sm btn-outline-dark me-2">Провести</button>
                        </div>
                        <div>
                            <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => {
                                    setIsOpen(false);
                                }}>отмена</button>
                        </div>
                    </div>
                </form>
            </div>
        </div > : <button
            className="btn btn-sm btn-outline-dark text-nowrap"
            onClick={() => {
                setIsOpen(true);
            }}>Добавить оплату</button>
        }

    </>
}

const onSubmit = (data: any, resetForm: any, is_boss: any) => {
    const formdata = new FormData();
    formdata.append("lead_id", data.lead_id);
    formdata.append("sum", data.sum);
    console.log('image', data.image);
    console.log('data #vf4', data);

    if (!data.sum) { toast.error('Некорректно заполнена форма'); return; }
    if ((!data.image?.length) && !is_boss) { toast.error('Некорректно заполнена форма'); return; }
    // (data.image?.length)
    for (const key in data) {
        const element = data[key];
        if (key === "image") {
            for (let i = 0; i < element.length; i++) {
                formdata.append('image', element[i]);
            }
            continue;
        }

    }
    formdata
    fetch(
        "/api/payments/create",
        {
            method: "POST",
            body: formdata
            // body: JSON.stringify(data)
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