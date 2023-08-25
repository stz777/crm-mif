"use client"

import FieldWrapper from "@/app/ui/form/fieldWrapper";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from 'react-toastify';

type FormValues = {
    username: string
    phones: { phone: string }[];
    emails: { email: string }[];
    telegram_id: string;
    role: string
};

export default function CreateEmployeeForm() {
    const { register, handleSubmit, formState: { errors }, control, reset } = useForm<FormValues>(
        {
            defaultValues: {
                phones: [{ phone: "" }],
                emails: [{ email: "" }],
            }
        }
    );
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
        <form onSubmit={handleSubmit(e => onSubmit(e, reset))}>

            <FieldWrapper title="Имя сотрудника"
                field={<>
                    <input {...register("username", { required: true })} autoComplete="off" className="form-control" />
                </>}
            />

            <FieldWrapper title="Телефоны"
                field={<>
                    {phonesFields.map(({ id }, i) => <div key={id} className="d-flex">
                        <input {...register(`phones.${i}.phone`, { required: true })} autoComplete="off" className="form-control" />
                        {i > 0 && <div onClick={() => removePhone(i)} className="btn btn-outline-danger btn-sm">Удалить</div>}
                    </div>)}
                    {/* <div onClick={() => appendPhone({ phone: "" })} className="btn btn-outline-dark btn-sm mt-1">Добавить еще один телефон</div> */}
                </>}
            />

            <FieldWrapper title="Email"
                field={<>
                    {emailFields.map(({ id }, i) => <div key={id} className="d-flex">
                        <input {...register(`emails.${i}.email`, { required: true })} autoComplete="off" className="form-control" />
                        {i > 0 && <div onClick={() => removeEmail(i)} className="btn btn-outline-danger btn-sm">Удалить</div>}
                    </div>)}
                    {/* <div onClick={() => appendEmail({ email: "" })} className="btn btn-outline-dark btn-sm mt-1">Добавить еще один email</div> */}
                </>}
            />

            <FieldWrapper title="Телеграм"
                field={<>
                    <input {...register("telegram_id", { required: true })} autoComplete="off" className="form-control" />
                </>}
            />

            <FieldWrapper title="Должность"
                field={<>
                    <select {...register("role", { required: true })} defaultValue="" className="form-select" aria-label="Default select example">
                        <option value="" disabled>
                            Выберите должность
                        </option>
                        <option value="0">Исполнитель</option>
                        <option value="1">Менеджер</option>
                    </select>
                </>}
            />

            <button className="btn btn-sm btn-dark">Сохранить</button>

        </form>
    );
}

const onSubmit = (data: any, resetForm: any) => {
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
    ).then(data => {
        if (data.success) {
            toast.success("Сотрудник создан");
            resetForm();
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
                            err: "#admck3c9jm",
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


