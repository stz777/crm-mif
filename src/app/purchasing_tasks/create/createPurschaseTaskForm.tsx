"use client"
import FieldWrapper from "@/app/ui/form/fieldWrapper";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import ru from 'date-fns/locale/ru';
import { toast } from "react-toastify";

registerLocale('ru', ru);

type Inputs = {
    deadline: any
    title: string
    comment: string
};

export default function CreatePurschaseTaskForm() {
    const { register, handleSubmit, formState: { errors }, control, reset } = useForm<Inputs>();
    return (
        <form onSubmit={handleSubmit(e => onSubmit(e, reset))}>
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
            <FieldWrapper
                title="Заголовок"
                field={
                    <input {...register("title", { required: true })} autoComplete="off" />
                }
            />
            <FieldWrapper
                title="Описание"
                field={
                    <textarea  {...register("comment", { required: true })} autoComplete="off" />
                }
            />
            <button className="btn btn-sm btn-outline-dark">Сохранить</button>
        </form>
    );
}

const onSubmit = (data: any, resetForm: any) => {
    fetch(
        "/api/purchasing_tasks/create",
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
            toast.success("Задача-закупка создана");
            resetForm();
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
                            err: "#mdjasudy",
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
