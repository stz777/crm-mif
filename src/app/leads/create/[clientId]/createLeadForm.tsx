"use client"
import { registerLocale } from "react-datepicker";
import ru from 'date-fns/locale/ru';
import FieldWrapper from "@/app/ui/form/fieldWrapper";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
registerLocale('ru', ru);

type FormValues = {
    title: string
    client: number
    description: string
    deadline: any
    sum: number
};

export default function CreateLeadForm({ clientId }: { clientId: number }) {
    const { register, handleSubmit, formState: { errors }, control, reset } = useForm<FormValues>({
        defaultValues: {
            // title: "title",
            client: clientId,
            // description: "description",
            // sum: 123,
        }
    });
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

            <FieldWrapper title="Заголовок"
                field={<>
                    <input {...register("title", { required: true })} autoComplete="off" />
                </>}
            />
            {/* <FieldWrapper title="Id клиента"
                field={<>
                    <input {...register("client", { required: true })} placeholder="ID клиента" autoComplete="off" disabled />
                </>}
            /> */}
            <FieldWrapper title="Описание"
                field={<>
                    <textarea {...register("description", { required: true })} autoComplete="off" />
                </>}
            />

            <FieldWrapper title="Сумма заказа"
                field={<>
                    <input type="number" {...register("sum", { required: true })} autoComplete="off" />
                </>}
            />

            {/* <input type="submit" /> */}
            <button className="btn btn-sm btn-outline-dark">Сохранить</button>
        </form>
    );
}

const onSubmit = (data: any, resetForm: any) => {
    fetch(
        "/api/leads/create",
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
            toast.success("Заказ создан");
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
