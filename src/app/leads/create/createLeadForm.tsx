"use client"
import { registerLocale } from "react-datepicker";
import ru from 'date-fns/locale/ru';
import FieldWrapper from "@/app/ui/form/fieldWrapper";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
registerLocale('ru', ru)

type FormValues = {
    title: string
    client: number
    description: string
    deadline: any
};

export default function CreateLeadForm() {
    const { register, handleSubmit, formState: { errors }, control } = useForm<FormValues>({
        defaultValues: {
            title: "title",
            client: 2,
            description: "description",
        }
    });
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
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
                    <input {...register("title", { required: true })} placeholder="Заголовок" />
                </>}
            />
            <FieldWrapper title="Id клиента"
                field={<>
                    <input {...register("client", { required: true })} placeholder="ID клиента" />
                </>}
            />
            <FieldWrapper title="Описание"
                field={<>
                    <textarea {...register("description", { required: true })} placeholder="Описание" />
                </>}
            />
            <input type="submit" />
        </form>
    );
}

const onSubmit = (data: any) => {
    fetch(
        "/api/leads/create",
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
