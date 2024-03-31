import FieldWrapper from "@/app/ui/form/fieldWrapper";
import LeadFields from "@/app/clients/create/createClientForm/leadFields";
import ClientFields from "@/app/clients/create/createClientForm/clientFields";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect } from "react";
import { useStore } from "effector-react";
import { $insertedPhone } from "./store/insertedPhone";
import { FaTrash } from "react-icons/fa";
import onSubmit from "./onsubmit";

export default function CreateClientForm() {
    const insertedPhone = useStore($insertedPhone);
    const { register, handleSubmit, control, reset, watch, setValue, resetField } = useForm<any>();

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

    const inputValue: any = watch('image');

    useEffect(() => {
        appendPhone({ phone: insertedPhone });
    }, [insertedPhone]);

    // useEffect(() => {
    //     customSetValues(setValue, appendEmail)
    // }, [insertedPhone]);


    return (
        <form
            onSubmit={handleSubmit((e: any) => onSubmit(e))}
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
                            <input className="form-control"  {...register("payment",)} autoComplete="off" />
                        </>}
                    />
                    <FieldWrapper title="Чек"
                        field={<>
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
                        </>}
                    />
                </tbody>
            </table>
            <button className="btn btn-sm btn-outline-dark">Сохранить</button>
        </form>
    );
}


// type SetValueType = 

function customSetValues(setValue: any, appendEmail: any) {
    // setValue();
    console.log('appendEmail', appendEmail);

    appendEmail({ email: 'manamana@adsa.ru' });
    setValue("fio", "шмио");
    setValue("emails.0.email", "manamana@adsa.ru");
    setValue("telegram.0.telegram", "oooaaa");
    setValue("address", "пионерская");
    setValue("deadline", new Date());
    setValue("payment", '3123');
    setValue("description", 'нормальный платеж');
    setValue("descr", 'нормальный платеж');
    setValue("sum", '3123');
}