import FieldWrapper from "@/app/ui/form/fieldWrapper";
import LeadFields from "@/app/clients/create/createClientForm/leadFields";
import ClientFields from "@/app/clients/create/createClientForm/clientFields";
import { toast } from "react-toastify";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect } from "react";
import { useStore } from "effector-react";
import { $insertedPhone } from "./store/insertedPhone";
import { reset } from "./store/modalState";

export default function CreateClientForm() {
    const insertedPhone = useStore($insertedPhone);
    const { register, handleSubmit, control, reset, getValues, setValue } = useForm<any>();
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
    useEffect(() => {
        appendPhone({ phone: insertedPhone })
    }, [insertedPhone])
    return (
        <form
            onSubmit={handleSubmit((e: any) => onSubmit(e, reset))}
            style={{ maxWidth: "1000px" }}
        >
            <table className="table-borderless">
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
                        setValue={setValue}
                    />
                    <tr><th><>Заказ</></th><td></td></tr>
                    <LeadFields
                        control={control}
                        register={register}
                    />
                    <FieldWrapper title="Оплачено"
                        field={<>
                            <input className="form-control"  {...register("payment", { required: true })} autoComplete="off" />
                        </>}
                    />
                    <FieldWrapper title="Чек"
                        field={<>
                            <input type="file" id="image" {...register("image")} className="d-none" />
                            <label htmlFor="image">
                                <div className="btn btn-dark">Выбрать файл</div>
                            </label>
                        </>}
                    />
                </tbody>
            </table>
            <button className="btn btn-sm btn-outline-dark">Сохранить</button>
        </form>
    );
}


const onSubmit = (data: any, resetForm: any) => {

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

    if (!data?.payment) {
        toast.error('Заполните поле "оплачено"');
        return;
    }
    if (!data?.sum) {
        toast.error('Заполните поле "сумма заказа"');
        return;
    }
    if (!data?.description) {
        toast.error('Заполните поле "описание"');
        return;
    }

    if (!data.deadline) {
        toast.error('Заполните поле "дедлайн');
        return;
    }

    // if (
    //     !is_boss
    //     &&
    //     ((data.payment || data.image.length)
    //         &&
    //         !(data.payment && data.image.length)
    //     )
    // ) {
    //     toast.error('Прикрепите изображение к платежу');
    //     return;
    // }

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
            setTimeout(() => {
                reset();
            }, 300);
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