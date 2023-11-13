"use client"

import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ClientFields from "./clientFields";
import LeadFields from "./leadFields";
import FieldWrapper from "@/app/ui/form/fieldWrapper";

type FormValues = {
    fio: string
    phones: { phone: string }[];
    emails: { email: string }[];
    telegram: { telegram: string }[];
    address: string;
    payment: number;
    image: any;
};

export default function CreateClientForm(
    props: { is_boss: boolean }
) {
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
        <form
            onSubmit={handleSubmit(e => onSubmit(e, reset, props.is_boss))}
            style={{ maxWidth: "1000px" }}
        >
            <table className="table">
                <tbody>
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
                    <tr><th><h4>Заказ</h4></th><td></td></tr>
                    <LeadFields
                        control={control}
                        register={register}
                    />
                    <tr><th><h4>Оплата</h4></th><td></td></tr>
                    <FieldWrapper title="Сумма"
                        field={<>
                            <input className="form-control"  {...register("payment")} autoComplete="off" />
                        </>}
                    />
                    <FieldWrapper title="Изображение"
                        field={<>
                            <input type="file" {...register("image"/* , { required: true } */)}
                            />
                        </>}
                    />
                </tbody>
            </table>
            <button className="btn btn-sm btn-outline-dark">Сохранить</button>
        </form>
    );
}


const onSubmit = (data: any, resetForm: any, is_boss: boolean) => {

    const formdata = new FormData();

    for (const key in data) {
        const element = data[key];
        if (key === "phones") {
            formdata.append("phones", JSON.stringify(element));
            continue;
        }
        if (key === "emails") {
            formdata.append("emails", JSON.stringify(element));
            continue;
        }
        if (key === "telegram") {
            formdata.append("telegram", JSON.stringify(element));
            continue;
        }

        if (key === "image") {
            for (let i = 0; i < element.length; i++) {
                formdata.append('images', element[i]);
            }
            continue;
        }

        formdata.append(key, element);
    }

    if (!data?.phones?.length) {
        toast.error('Нужно заполнить поле "телефон"');
        return;
    }

    if (
        (data.deadline || data.description || data.sum)
        &&
        !(data.deadline && data.description && data.sum)
    ) {
        toast.error('Чтобы создать заказ, нужно заполнить все поля');
        return;
    }

    if (
        !is_boss
        &&
        ((data.payment || data.image.length)
            &&
            !(data.payment && data.image.length)
        )
    ) {
        toast.error('Прикрепите изображение к платежу');
        return;
    }

    fetch(
        "/api/clients/create",
        {
            method: "POST",
            body: formdata
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
            resetForm();
        } else {
            toast.error("Что-то пошло не так " + data.error);
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