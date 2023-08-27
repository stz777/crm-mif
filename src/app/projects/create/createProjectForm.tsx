"use client"

import FieldWrapper from "@/app/ui/form/fieldWrapper";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { registerLocale } from "react-datepicker";
import DatePicker from "react-datepicker";
import ru from 'date-fns/locale/ru';
import dayjs from "dayjs";
registerLocale('ru', ru);

type FormValues = {
    title: string
    comment: string
    deadline: any
    role: string
};

export default function CreateEmployeeForm() {
    const { register, handleSubmit, formState: { errors }, control, reset } = useForm<FormValues>();
    return (
        <form onSubmit={handleSubmit(e => onSubmit(e, reset))}>
            <FieldWrapper title="Название проекта"
                field={<>
                    <input {...register("title", { required: true })} autoComplete="off" className="form-control" />
                </>}
            />
            <FieldWrapper title="Описание"
                field={<>
                    <textarea {...register("comment", { required: true })} autoComplete="off" className="form-control" />
                </>}
            />
            <FieldWrapper title="Дедлайн"
                field={<>
                    <Controller
                        control={control}
                        name="deadline"
                        render={({ field }) => (
                            <DatePicker
                                locale="ru"
                                {...field}
                                dateFormat="dd.MM.yyyy"
                                selected={field.value}
                                onChange={(date) => field.onChange(date)}
                                placeholderText="выберите дату"
                            />
                        )}
                    />
                </>}
            />
            <button className="btn btn-sm btn-dark">Сохранить</button>
        </form>
    );
}

const onSubmit = (data: any, resetForm: any) => {

    console.log({
        data: {
            ...data,
            deadline: dayjs(data.deadline).format("YYYY-MM-DD HH:mm:ss")
        }
    });


    fetch(
        "/api/projects/create",
        {
            method: "POST",
            body: JSON.stringify({
                ...data,
                deadline: dayjs(data.deadline).format("YYYY-MM-DD HH:mm:ss")
            })
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
            toast.success("Проект создан");
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
                            err: "#asdhHs8",
                            data: {
                                statusText,
                                values: data
                            }
                        }
                    })
                }
            )
                .then(x => x.json())
        })
}
