"use client"

import FieldWrapper from "@/app/ui/form/fieldWrapper";
import { useForm } from "react-hook-form";

export default function CreateClientForm() {
    const { register, handleSubmit, formState: { errors } } = useForm();

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <FieldWrapper
                title="Имя клиента"
                field={<>
                    <input {...register("fio", { required: true })} />
                    <div>{errors.fio && <span>Это обязательное поле</span>}</div>
                </>}
            ></FieldWrapper>

            <input type="submit" />
        </form>
    );
}


const onSubmit = (data: any) => {
    console.log(data);
}