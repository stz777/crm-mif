"use client"

import FieldWrapper from "@/app/ui/form/fieldWrapper";
import { log } from "console";
import { useFieldArray, useForm } from "react-hook-form";

type FormValues = {
    fio: string
    phones: { phone: string }[];
    emails: { email: string }[];
    telegram: string;
};

export default function CreateEmployeeForm() {
    const { register, handleSubmit, formState: { errors }, control } = useForm<FormValues>();
    const { fields: phonesFields, append: appendPhone, remove: removePhone } = useFieldArray({
        control,
        name: "phones",
        rules: {
            minLength: 1
        }
    });
    const { fields: emailFields, append: appendEmail, remove: removeEmail } = useFieldArray({
        control,
        name: "emails",
        rules: {
            minLength: 1
        }
    });
    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <FieldWrapper title="Имя сотрудника"
                field={<>
                    <input {...register("fio", { required: true })} />
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
                    <input {...register("telegram", { required: true })} />
                </>}
            />

            <button className="btn btn-sm btn-dark">Сохранить</button>

        </form>
    );
}

const onSubmit = (data: any) => {
    fetch(
        "/api/employees/create",
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
    )
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
                            err: "#admck3jm",
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


