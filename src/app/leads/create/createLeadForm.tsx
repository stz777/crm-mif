"use client"

import FieldWrapper from "@/app/ui/form/fieldWrapper";
import { useForm } from "react-hook-form";

type FormValues = {
    title: string
    client: number
    description: string
    deadline: string
};

export default function CreateLeadForm() {
    const { register, handleSubmit, formState: { errors }, control } = useForm<FormValues>({
        defaultValues:{
            
        }
    });
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FieldWrapper title="Заголовок"
                field={<>
                    <input {...register("title", { required: true })} placeholder="Заголовок" />
                </>}
            />
            <FieldWrapper title="Id клиента"
                field={<>
                    <input {...register("client", { required: true })} placeholder="ID клиента" />
                </>}
            />
            <FieldWrapper title="Описание"
                field={<>
                    <textarea {...register("description", { required: true })} placeholder="Описание" />
                </>}
            />
            <input type="submit" />
        </form>
    );
}

const onSubmit = (data: any) => {
    console.log(data);
    fetch(
        "/api/leads/create",
        {
            method: "POST",
            body: JSON.stringify(data)
        }
    ).then(
        x => x.json()
    )
        .then(x => {
            console.log('x', x);
        })
}
