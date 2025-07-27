"use client"

import { useForm, SubmitHandler } from "react-hook-form"
import { toast } from "react-toastify"
import { setAuthStep } from "./startAuth"

type Inputs = {
    login: string
    password: string
}

export default function AuthForm() {

    const {
        register,
        handleSubmit,
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
                // alert(123)
                document.cookie = `auth=${data.token}; expires=Tue, 19 Jan 2038 03:14:07 GMT; SameSite=Strict;`;
                // toast.success("Вы успешно авторизировались;");
                window.location.pathname = "/";
                // setAuthStep(2);
            } else {
                toast.error("Что-то пошло не так " + data.error);
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
            <div>
                <input  {...register("login")} className="form-control " style={{ maxWidth: "300px" }} autoComplete="off" placeholder="логин" />
            </div>
            <div>
                <input  {...register("password")} className="form-control " style={{ maxWidth: "300px" }} autoComplete="off" placeholder="пароль" />
            </div>
            <button className="btn btn-sm btn-outline-dark mt-2">Ввод</button>
        </form>
    )
}