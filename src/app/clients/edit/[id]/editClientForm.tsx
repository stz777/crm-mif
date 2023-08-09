"use client"

import FieldWrapper from "@/app/ui/form/fieldWrapper";
import { useFieldArray, useForm } from "react-hook-form";
import { ClientInterface } from "../../get/page";

type FormValues = {
    fio: string
    phones: { phone: string }[];
    emails: { email: string }[];
    telegram: { telegram: string }[];
};

export default function EditClientForm(props: { clientData: ClientInterface }) {

    const { register, handleSubmit, formState: { errors }, control } = useForm<FormValues>(
        {
            defaultValues: {
                fio: props.clientData.full_name,
                phones: props.clientData.meta.filter(item => item.data_type === "phone").map(item => ({ phone: item.data })),
                telegram: props.clientData.meta.filter(item => item.data_type === "telegram").map(item => ({ telegram: item.data })),
                emails: props.clientData.meta.filter(item => item.data_type === "email").map(item => ({ email: item.data })),
            }
        }
    );

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
        <form onSubmit={handleSubmit(data => onSubmit(data, props.clientData.id))}>

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


const onSubmit = (data: any, clientId: number) => {
    fetch(
        `/api/clients/edit/${clientId}`,
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


// fetch("/api/clients/edit/18",
//     {
//         method: "POST",
//         body:JSON.stringify(null)
//     })