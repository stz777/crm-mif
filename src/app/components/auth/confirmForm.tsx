"use client"

import { useForm, SubmitHandler } from "react-hook-form"
import { toast } from "react-toastify"

type Inputs = {
    code: string
}

export default function ConfirmForm() {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        fetch(
            `/api/auth/confirm`,
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
                document.cookie = `auth=${data.token}; path=/; expires=Tue, 19 Jan 2038 03:14:07 GMT`;
                toast.success("Успех");
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
                                err: "#m3n5vh0s7",
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
            <input  {...register("code")} className="form-control " style={{ maxWidth: "300px" }} autoComplete="off" placeholder="Введите пароль" />
            <button className="btn btn-sm btn-outline-dark mt-2">Ввод</button>
        </form>
    )
}