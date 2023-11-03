"use client"
import { registerLocale } from "react-datepicker";
import ru from 'date-fns/locale/ru';
import FieldWrapper from "@/app/ui/form/fieldWrapper";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { ClientInterface } from "@/app/components/types/clients";
import Link from "next/link";
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

export default function CreateLeadForm({ is_boss }: { is_boss: boolean }) {

    const { register, handleSubmit, formState: { errors }, control, reset, setValue, watch } = useForm<FormValues>({
        defaultValues: {
            title: "",
        }
    });

    const clientIsSelected = !!watch('client');

    return (
        <form onSubmit={handleSubmit(e => onSubmit(e, reset, is_boss))}>

            <ClientFields setValue={setValue} clientIsSelected={!!clientIsSelected} />
            {clientIsSelected && <>
                <table className="table">
                    <tbody>
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
                                            autoComplete="off"
                                        />
                                    )}
                                />
                            </>}
                        />

                        <FieldWrapper title="Описание"
                            field={<>
                                <textarea {...register("description", { required: true })} rows={5} autoComplete="off" />
                            </>}
                        />

                        <FieldWrapper title="Сумма заказа"
                            field={<>
                                <input {...register("sum", { required: true })} autoComplete="off" />
                            </>}
                        />
                    </tbody>
                </table>

                <div className="m-2 p-2 border">
                    <h4>Оплата</h4>
                    <table className="table">
                        <tbody>
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
                        </tbody>
                    </table>
                </div>



                <button className="btn btn-sm btn-outline-dark">Сохранить</button>
            </>}

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

function ClientFields(props: { setValue: any, clientIsSelected: boolean }) {

    const [load, setLoad] = useState(false);
    const [clientsList, setClients] = useState<ClientInterface[] | null>(null);

    const [client, setClient] = useState<ClientInterface | null>(null);

    useEffect(() => {
        if (props.clientIsSelected === false) {
            setLoad(false); setClients(null); setClient(null);
        }
    }, [props.clientIsSelected])


    if (client) return <>
        <h4>Клиент</h4>
        <table className="table">
            <tbody>
                <tr><th>id</th><td>{client.id}</td></tr>
                <tr><th>наименование</th><td>{client.full_name}</td></tr>
                <tr><th>телефон</th><td>{client.meta.find(item => item.data_type === "phone")?.data}</td></tr>
            </tbody>
        </table>
    </>

    return <>
        <div className="m-2 p-2 border">
            <h4>Клиент</h4>
            <input placeholder="Телефон клиента"
                autoComplete="off"
                onChange={({ target }) => {
                    const { value } = target;
                    if (value.length > 3 && /^[+0-9]+$/.test(value)) {
                        setLoad(true);
                        fetch(
                            `/api/clients/get/by-phone-number`,
                            {
                                method: "POST",
                                body: JSON.stringify({
                                    phone: value
                                })
                            }
                        )
                            .then(x => x.json())
                            .then(x => {
                                if (x.clients) {
                                    setClients(x.clients)
                                }
                                setLoad(false);
                            })
                    } else {
                        setClients(null);
                    }
                }}
            />

            <div>
                {(() => {
                    if (load) return <>Загрузка...</>
                    if (!clientsList) return null;
                    if (!clientsList.length) return <>
                        <div>Клиента с таким телефоном нет в базе</div>
                        <div><Link href={`/clients/create`} className="btn btn-sm btn-outline-dark">Создать</Link></div>
                    </>
                    return <>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Наименование клиента</th>
                                    <th>Телефон</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientsList.map(client => <tr key={client.id}>
                                    <td>{client.full_name}</td>
                                    <td>{client.meta.find(item => item.data_type === "phone")?.data}</td>
                                    <td><button className="btn btn-sm btn-outline-dark"
                                        onClick={() => {
                                            setClient(client);
                                            props.setValue("client", client.id)
                                        }}
                                    >Выбрать</button></td>
                                </tr>)}
                            </tbody>
                        </table>
                    </>
                })()}
            </div>
        </div>
    </>
}