"use client"

import FieldWrapper from "@/app/ui/form/fieldWrapper";
import { useFieldArray, useForm } from "react-hook-form";
import { ClientInterface } from "../../get/page";
import { toast } from "react-toastify";

type FormValues = {
    fio: string
    address: string
    phones: { phone: string }[];
    emails: { email: string }[];
    telegram: { telegram: string }[];
};

export default function EditClientForm(props: { clientData: ClientInterface }) {

    const { register, handleSubmit, formState: { errors }, control } = useForm<FormValues>(
        {
            defaultValues: {
                fio: props.clientData.full_name,
                address: props.clientData.address,
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
                    <input {...register("fio", { required: true })} placeholder="Наименование" />
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
                        <input placeholder="Введите email" {...register(`emails.${i}.email`, { required: true })} />
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

            <FieldWrapper title="Адрес"
                field={<>
                    <textarea {...register("address", { required: true })} placeholder="Адрес" autoComplete="off" />
                </>}
            />

            <button className="btn btn-sm btn-outline-dark">Сохранить</button>
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
        response => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error(response.statusText);
            }
        }
    ).then(data => {
        if (data.success) {
            toast.success("Данные клиента изменены");
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
                            err: "#jdsjfdn4n*d",
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

}