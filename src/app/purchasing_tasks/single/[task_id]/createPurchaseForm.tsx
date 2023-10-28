"use client"
import FieldWrapper from "@/app/ui/form/fieldWrapper";
import { useForm } from "react-hook-form";
import { registerLocale } from "react-datepicker";
import ru from 'date-fns/locale/ru';
import { toast } from "react-toastify";
import { MaterialInterface } from "@/app/components/types/material";

registerLocale('ru', ru);

type Inputs = {
    comment: string
    sum: number
    material: number
    task_id: number
};

export default function CreatePurschaseForm(props: { task_id: number, materials: MaterialInterface[] }) {
    const { register, handleSubmit, formState: { errors }, control, reset } = useForm<Inputs>({
        defaultValues: {
            task_id: props.task_id,
        }
    });
    return (
        <form onSubmit={handleSubmit(e => onSubmit(e, reset))}>
            <div className="card w-auto">
                <div className="card-header">
                    <div className="h3 m-0 p-0">Создать закупку</div>
                </div>
                <div className="card-body">
                    <FieldWrapper
                        title="Описание"
                        field={
                            <textarea  {...register("comment", { required: true })} className="form-control" autoComplete="off" />
                        }
                    />
                    <FieldWrapper
                        title="Стоимость"
                        field={
                            <input  {...register("sum", { required: true })} className="form-control" autoComplete="off" />
                        }
                    />
                    <FieldWrapper
                        title="Материал"
                        field={
                            <select {...register("material", { required: true })} defaultValue="" className="form-select" aria-label="Default select example">
                                <option value="" disabled>
                                    Выберите материал
                                </option>
                                {
                                    props.materials
                                        .map(material => <option key={material.id} value={String(material.id)}>{material.name}</option>)
                                }
                            </select>
                        }
                    />
                    <button className="btn btn-sm btn-outline-dark">Сохранить</button>
                </div>
            </div>

        </form>
    );
}

const onSubmit = (data: any, resetForm: any) => {
    fetch(
        "/api/purchases/create",
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
            toast.success("Закупка создана");
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
                            err: "#mdnnNf777",
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
