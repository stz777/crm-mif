"use client"

import { useForm, SubmitHandler } from "react-hook-form"
import { toast } from "react-toastify"
import { setAuthStep } from "./startAuth"

type Inputs = {
    login: string
}

export default function AuthForm() {

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        fetch(
            `/api/auth/login`,
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
                setAuthStep(2);
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
                                err: "#dm3mnd0dj",
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
            });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
            <input  {...register("login")} className="form-control " style={{ maxWidth: "300px" }} autoComplete="off" placeholder="Введите логин"/>
            <button className="btn btn-sm btn-outline-dark mt-2">Ввод</button>
        </form>
    )
}