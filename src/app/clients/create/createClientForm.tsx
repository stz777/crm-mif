"use client"

import FieldWrapper from "@/app/ui/form/fieldWrapper";
import { useFieldArray, useForm } from "react-hook-form";

interface PhoneFiels {
    phone: string
}

type FormValues = {
    fio: string
    phones: PhoneFiels[];
};

export default function CreateClientForm() {
    const { register, handleSubmit, formState: { errors }, control } = useForm<FormValues>();
    const { fields: phonesFields, append: appendPhone, remove: removePhone } = useFieldArray({
        control,
        name: "phones",
    });
    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <FieldWrapper title="Имя клиента"
                field={<>
                    <input {...register("fio", { required: true })} />
                    <div>{errors.fio && <span>Это обязательное поле</span>}</div>
                </>}
            />

            <FieldWrapper title="Телефоны"
                field={<>
                    {phonesFields.map(({ id }, i) => <div key={id} className="d-flex">
                        <input placeholder="Введите номер телефона" {...register(`phones.${i}.phone`, { required: true })} />
                        <div onClick={() => removePhone(i)} className="btn btn-outline-danger btn-sm">Удалить</div>
                    </div>)}
                    <div onClick={() => appendPhone({ phone: "" })} className="btn btn-outline-dark btn-sm">Добавить номер</div>
                </>}
            />

            <input type="submit" />
        </form>
    );
}


const onSubmit = (data: any) => {
    console.log(data);
}