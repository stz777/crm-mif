"use client"

import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"

type Inputs = {
    lead_id: number
    sum: number
}

export function Add_Payment(props: { lead_id: number }) {
    const [isOPen, setIsOpen] = useState(true);
    const { register, handleSubmit, } = useForm<Inputs>({
        defaultValues: {
            lead_id: props.lead_id
        }
    })
    return <>
        {isOPen && <>
            <form onSubmit={handleSubmit(onSubmit)} className="mb-2">
                <div className="text-strong">Введите сумму оплаты</div>
                <input {...register("sum")} type="number" />
                <button className="btn btn-sm btn-outline-dark ms-2">Провести</button>
            </form>
        </>}
        {/* <button
            className="btn btn-sm btn-outline-dark"
            onClick={() => {
                setIsOpen(!isOPen);
            }}>{isOPen ? "свернуть" : "провести оплату"}</button> */}
    </>
}

const onSubmit: SubmitHandler<Inputs> = (data) => {
    fetch(
        "/api/payments/create",
        {
            method: "POST",
            body: JSON.stringify(data)
        }
    )
    console.log(data)
}