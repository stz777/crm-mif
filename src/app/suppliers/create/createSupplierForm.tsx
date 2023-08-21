"use client"

import FieldWrapper from "@/app/ui/form/fieldWrapper";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type FormValues = {
    name: string
    contacts: string;
};

export default function CreateSupplierForm() {
    const { register, handleSubmit, formState: { errors }, control, reset } = useForm<FormValues>();
    return (
        <form onSubmit={handleSubmit(e => onSubmit(e, reset))}>

            <FieldWrapper title="Наименование"
                field={<>
                    <input {...register("name", { required: true })} />
                </>}
            />
            <FieldWrapper title="Контакты"
                field={<>
                    <textarea {...register("contacts", { required: true })} />
                </>}
            />
            <button className="btn btn-sm btn-outline-dark">Сохранить</button>
        </form>
    );
}


const onSubmit = (data: any, resetForm: any) => {
    fetch(
        "/api/suppliers/create",
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
            toast.success("Поставщик создан");
            resetForm();
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
                            err: "#dasdj3nJjdshsj3",
                            text: "ошибка создания постащика",
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