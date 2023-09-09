"use client"

import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ClientFields from "./clientFields";
import LeadFields from "./leadFields";

type FormValues = {
    fio: string
    phones: { phone: string }[];
    emails: { email: string }[];
    telegram: { telegram: string }[];
    address: string;
};

export default function CreateClientForm() {
    const { register, handleSubmit, control, reset } = useForm<FormValues>();
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
        <form onSubmit={handleSubmit(e => onSubmit(e, reset))}>

            <ClientFields
                register={register}
                phonesFields={phonesFields}
                removePhone={removePhone}
                appendPhone={appendPhone}
                emailFields={emailFields}
                removeEmail={removeEmail}
                appendEmail={appendEmail}
                telegramFields={telegramFields}
                removeTelegram={removeTelegram}
                appendTelegram={appendTelegram}
            />
            <div className="m-2 p-2 border">
                <h4>Заказ</h4>
                <LeadFields
                    control={control}
                    register={register}
                />
            </div>

            <button className="btn btn-sm btn-outline-dark">Сохранить</button>
        </form>
    );
}


const onSubmit = (data: any, resetForm: any) => {
    console.log('data', data);
    if (!data?.phones?.length) { toast.error('Нужно заполнить поле "телефон"') }
    fetch(
        "/api/clients/create",
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
            toast.success("Клиент создан");
            resetForm()
        } else {
            toast.error("Что-то пошло не так");
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
                            err: "#admDfck3jm",
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