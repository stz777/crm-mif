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
    payment: number
    image: any
};

export default function CreateLeadForm({ clientId, is_boss }: { clientId: number, is_boss: boolean }) {
    const { register, handleSubmit, formState: { errors }, control, reset } = useForm<FormValues>({
        defaultValues: {
            title: "",
            client: clientId,
            // description: "description",
            // sum: 123,
        }
    });
    return (
        <form onSubmit={handleSubmit(e => onSubmit(e, reset, is_boss))}>
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

            <FieldWrapper title="Описание"
                field={<>
                    <textarea {...register("description", { required: true })} autoComplete="off" />
                </>}
            />

            <FieldWrapper title="Сумма заказа"
                field={<>
                    <input {...register("sum", { required: true })} autoComplete="off" />
                </>}
            />

            <div className="m-2 p-2 border">
                <h4>Оплата</h4>
                <FieldWrapper title="Сумма"
                    field={<>
                        <input {...register("payment")} autoComplete="off" />
                    </>}
                />
                <FieldWrapper title="Изображение"
                    field={<>
                        <input type="file" {...register("image"/* , { required: true } */)}
                        />
                    </>}
                />
            </div>

            {/* <input type="submit" /> */}
            <button className="btn btn-sm btn-outline-dark">Сохранить</button>
        </form>
    );
}

const onSubmit = (data: any, resetForm: any, is_boss: boolean) => {

    const formdata = new FormData();


    if (!data.deadline) {
        toast.error(`Нужно заполнить все поля`)
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



    for (const key in data) {
        const element = data[key];

        if (key === "image") {
            for (let i = 0; i < element.length; i++) {
                formdata.append('images', element[i]);
            }
            continue;
        }

        formdata.append(key, element);
    }



    fetch(
        "/api/leads/create",
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
                            err: "#acdmckK3jm",
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
