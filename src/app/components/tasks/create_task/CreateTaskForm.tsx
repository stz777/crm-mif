"use client"

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type FormValues = {
    description: string
   
};

export default function CreateTaskForm() {
    const { register, handleSubmit, control, reset } = useForm<FormValues>();



    return <>
        <form
            onSubmit={handleSubmit(e => onSubmit(e, reset))}
            style={{ maxWidth: "1000px" }}
        >
            <input className="form-control" placeholder="Введите номер телефона" {...register(`description`, { required: true })} autoComplete="off" />
        </form>
    </>;
}


const onSubmit = (data: any, resetForm: any) => {

    const formdata = new FormData();

    for (const key in data) {
        const element = data[key];
        if (key === "phones") {
            formdata.append("phones", JSON.stringify(element));
            continue;
        }
        if (key === "emails") {
            formdata.append("emails", JSON.stringify(element));
            continue;
        }
        if (key === "telegram") {
            formdata.append("telegram", JSON.stringify(element));
            continue;
        }

        if (key === "image") {
            for (let i = 0; i < element.length; i++) {
                formdata.append('images', element[i]);
            }
            continue;
        }

        formdata.append(key, element);
    }

    if (!data?.phones?.length) {
        toast.error('Нужно заполнить поле "телефон"');
        return;
    }

    if (
        (data.deadline || data.description || data.sum)
        &&
        !(data.deadline && data.description && data.sum)
    ) {
        toast.error('Чтобы создать заказ, нужно заполнить все поля');
        return;
    }

    fetch(
        String(process.env.TASK_MANAGES_URL) + "/api/tasks/create",
        // "/api/clients/create",
        {
            method: "POST",
            body: formdata
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
            toast.success("Клиент создан");
            resetForm();
        } else {
            toast.error("Что-то пошло не так " + data.error);
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
                            err: "#djvf7d",
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