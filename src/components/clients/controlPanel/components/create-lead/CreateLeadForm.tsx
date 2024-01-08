import { useState } from "react";
import { toast } from "react-toastify";
import { $selectedClient } from "./store/selectedClient";
import { useStore } from "effector-react";
import { Controller, useForm } from "react-hook-form";
import { registerLocale } from "react-datepicker";
import ru from 'date-fns/locale/ru';
import DatePicker from "react-datepicker";
import { reset } from "./store/modalState";
import { FaTrash } from "react-icons/fa";

registerLocale('ru', ru);

export function CreateLeadForm(
) {
    const client = useStore($selectedClient);
    const [viewPayment, setViewPayment] = useState(false);

    const { register, handleSubmit, control, watch, resetField } = useForm<any>({
        defaultValues: {
            title: "",
            client: client?.id,
        }
    });

    if (client === null) return <>Ошибка #b94n5</>

    const { meta } = client;

    const phone = meta.find(item => item.data_type === "phone")?.data;

    const inputValue: any = watch('image');


    return <div>
        <form onSubmit={handleSubmit((e: any) => onSubmit(e))}>
            <table className="table">
                <tbody>
                    <tr><td>Клиент</td><td>{client.full_name}</td></tr>
                    <tr><td>Телефон</td><td>{phone}</td></tr>
                    <tr><td>Описание</td><td><textarea {...register("description", { required: true })} rows={5} autoComplete="off" className="form-control" /></td></tr>
                    <tr><td>Дедлайн</td><td><Controller
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
                                autoComplete="off"
                                className="form-control"
                            />
                        )}
                    /></td></tr>
                    <tr><td>Сумма заказа</td><td><input {...register("sum", { required: true })} autoComplete="off" className="form-control" /></td></tr>

                    <tr><td><strong className="btn btn-sm btn-secondary" onClick={() => setViewPayment(!viewPayment)}>{viewPayment ? "Скрыть" : "Показать"} поля для оплаты</strong></td></tr>

                    {viewPayment && <>
                        <tr><td>Оплачено</td><td><input  {...register("payment", { required: true })} autoComplete="off" className="form-control" /></td></tr>
                        <tr><td>Изображение</td><td>
                            {(inputValue?.length)
                                ? <>
                                    <div className="mb-2">Прикреплен файл: {inputValue[0].name}</div>
                                    <div onClick={() => {
                                        resetField("image");
                                    }} className="btn btn-sm btn-outline-danger">Отмена <FaTrash /></div>
                                </>
                                : <>
                                    <input type="file" id="image" {...register("image")} className="d-none" />
                                    <label htmlFor="image" className="btn btn-secondary">Выберите файл</label>
                                </>}
                        </td></tr>
                    </>}

                </tbody>
            </table>
            <button className="btn btn-sm btn-primary">Создать</button>
        </form>
    </div>
}

async function onSubmit(data: any) {

    const formdata = new FormData();

    if (!data.deadline) {
        toast.error(`Нужно заполнить все поля`)
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
            reset();
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
                            err: "#d93nn",
                            data: {
                                statusText,
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