"use client"

import FieldWrapper from "@/app/ui/form/fieldWrapper";
import { useFieldArray, useForm } from "react-hook-form";

type FormValues = {
    fio: string
    phones: { phone: string }[];
    emails: { email: string }[];
    telegram: { telegram: string }[];
};

export default function CreateClientForm() {
    const { register, handleSubmit, formState: { errors }, control } = useForm<FormValues>();
    const { fields: phonesFields, append: appendPhone, remove: removePhone } = useFieldArray({
        control,
        name: "phones",
    });
    const { fields: emailFields, append: appendEmail, remove: removeEmail } = useFieldArray({
        control,
        name: "emails",
    });
    const { fields: telegramFields, append: appendTelegram, remove: removeTelegram } = useFieldArray({
        control,
        name: "telegram",
    });
    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <FieldWrapper title="Имя клиента"
                field={<>
                    <input {...register("fio", { required: true })} placeholder="ФИО" />
                </>}
            />

            <FieldWrapper title="Телефоны"
                field={<>
                    {phonesFields.map(({ id }, i) => <div key={id} className="d-flex">
                        <input placeholder="Введите номер телефона" {...register(`phones.${i}.phone`, { required: true })} />
                        <div onClick={() => removePhone(i)} className="btn btn-outline-danger btn-sm">Удалить</div>
                    </div>)}
                    <div onClick={() => appendPhone({ phone: "" })} className="btn btn-outline-dark btn-sm">Добавить</div>
                </>}
            />

            <FieldWrapper title="Email"
                field={<>
                    {emailFields.map(({ id }, i) => <div key={id} className="d-flex">
                        <input placeholder="Введите телеграм" {...register(`emails.${i}.email`, { required: true })} />
                        <div onClick={() => removeEmail(i)} className="btn btn-outline-danger btn-sm">Удалить</div>
                    </div>)}
                    <div onClick={() => appendEmail({ email: "" })} className="btn btn-outline-dark btn-sm">Добавить</div>
                </>}
            />

            <FieldWrapper title="Телеграм"
                field={<>
                    {telegramFields.map(({ id }, i) => <div key={id} className="d-flex">
                        <input placeholder="Введите email" {...register(`telegram.${i}.telegram`, { required: true })} />
                        <div onClick={() => removeTelegram(i)} className="btn btn-outline-danger btn-sm">Удалить</div>
                    </div>)}
                    <div onClick={() => appendTelegram({ telegram: "" })} className="btn btn-outline-dark btn-sm">Добавить</div>
                </>}
            />

            <input type="submit" />
        </form>
    );
}


const onSubmit = (data: any) => {
    fetch(
        "/api/clients/create",
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