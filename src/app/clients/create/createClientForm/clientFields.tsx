import FieldWrapper from "@/app/ui/form/fieldWrapper";

function ClientFields(props: {
    register: any,
    phonesFields: any
    removePhone: any
    appendPhone: any
    emailFields: any
    removeEmail: any
    appendEmail: any
    telegramFields: any
    removeTelegram: any
    appendTelegram: any
}) {


    return <>
        <FieldWrapper title="Телефоны"
            field={<>
                {props.phonesFields.map(({ id }: any, i: number) => <div key={id} className="d-flex">
                    <input className="form-control" placeholder="Введите номер телефона" {...props.register(`phones.${i}.phone`, { required: true })} autoComplete="off" />
                    <div onClick={() => props.removePhone(i)} className="btn btn-outline-danger btn-sm">Удалить</div>
                </div>)}
                <div onClick={() => props.appendPhone({ phone: "" })} className="btn btn-outline-dark btn-sm mt-2">Добавить</div>
            </>}
        />

        <FieldWrapper title="Наименование клиента"
            field={<>
                <input className="form-control" {...props.register("fio", { required: true })} autoComplete="off" />
            </>}
        />

        <FieldWrapper title="Email"
            field={<>
                {props.emailFields.map(({ id }: any, i: any) => <div key={id} className="d-flex">
                    <input className="form-control" placeholder="Введите email" {...props.register(`emails.${i}.email`, { required: true })} autoComplete="off" />
                    <div onClick={() => props.removeEmail(i)} className="btn btn-outline-danger btn-sm">Удалить</div>
                </div>)}
                <div onClick={() => props.appendEmail({ email: "" })} className="btn btn-outline-dark btn-sm">Добавить</div>
            </>}
        />

        <FieldWrapper title="Телеграм"
            field={<>
                {props.telegramFields.map(({ id }: any, i: any) => <div key={id} className="d-flex">
                    <input className="form-control" placeholder="Введите телеграм" {...props.register(`telegram.${i}.telegram`, { required: true })} autoComplete="off" />
                    <div onClick={() => props.removeTelegram(i)} className="btn btn-outline-danger btn-sm">Удалить</div>
                </div>)}
                <div onClick={() => props.appendTelegram({ telegram: "" })} className="btn btn-outline-dark btn-sm">Добавить</div>
            </>}
        />

        <FieldWrapper title="Адрес"
            field={<>
                <textarea className="form-control" {...props.register("address", { required: true })} placeholder="Адрес" autoComplete="off" />
            </>}
        />

    </>
}

export default ClientFields;