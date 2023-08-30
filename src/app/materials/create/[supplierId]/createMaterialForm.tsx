"use client"

import FieldWrapper from "@/app/ui/form/fieldWrapper";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type FormValues = {
    name: string
    supplier_id: number
};

export default function CreateMaterialForm(props: { supplier_id: number }) {
    const { register, handleSubmit, formState: { errors }, control, reset } = useForm<FormValues>(
        {
            defaultValues: { supplier_id: props.supplier_id }
        }
    );
    return (
        <form onSubmit={handleSubmit(e => onSubmit(e, reset))}>

            <table>
                <tbody>
                    <FieldWrapper title="Наименование"
                        field={<>
                            <input {...register("name", { required: true })} />
                        </>}
                    />
                </tbody>
            </table>

            <button className="btn btn-sm btn-outline-dark">Сохранить</button>
        </form>
    );
}


const onSubmit = (data: any, resetForm: any) => {
    fetch(
        "/api/materials/create",
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
            toast.success("Материал создан");
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
                            err: "#djd4ns8",
                            text: "ошибка создания материала",
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