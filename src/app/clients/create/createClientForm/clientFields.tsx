import FieldWrapper from "@/app/ui/form/fieldWrapper";
import { formatPhoneNumber } from "@/components/clients/controlPanel/components/tools/formatPhoneNumber";

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
    setValue: any
}) {


    return <>
        <FieldWrapper title="Телефоны"
            field={<>
                {props.phonesFields.map(({ id }: any, i: number) =>
                    <div key={id} className="d-flex mb-2">
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <div className="input-group-text">+7</div>
                            </div>
                            <div className="my-2"></div>
                            <input type="text" className="form-control"
                                {...props.register(`phones.${i}.phone`, {
                                    onChange: (e: any) => {
                                        const newString = formatPhoneNumber(e.target.value);
                                        props.setValue(`phones.${i}.phone`, newString);
                                    }
                                })}
                                placeholder="000 000 00 00" autoComplete="off" />
                        </div>
                        {i > 0 && <div>
                            <div onClick={() => props.removePhone(i)} className="btn btn-outline-danger btn-sm ms-2">Удалить</div>
                        </div>}
                    </div>)}

                <div onClick={() => props.appendPhone({ phone: "" })} className="border-bottom text-secondary d-inline pb-1" style={{ borderBottomStyle: "dashed", cursor: "pointer" }}>Добавить еще один номер</div>

            </>}
        />
        <FieldWrapper title="Наименование"
            field={<>
                <input className="form-control" {...props.register("fio", { required: true })} autoComplete="off" />
            </>}
        />
        <FieldWrapper title="Email"
            field={<>
                <input className="form-control" {...props.register(`emails.0.email`)} autoComplete="off" />
            </>}
        />
        <FieldWrapper title="Телеграм"
            field={<>
                <input className="form-control" {...props.register(`telegram.0.email`)} autoComplete="off" />
            </>}
        />
        <FieldWrapper title="Адрес"
            field={<>
                <textarea className="form-control" {...props.register("address", { required: true })} autoComplete="off" />
            </>}
        />

    </>
}

export default ClientFields;