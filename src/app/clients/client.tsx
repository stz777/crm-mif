"use client"

import { ClientInterface, ClientsSearchInterface } from "../components/types/clients"
import { useEffect, useState } from "react"
import clientMetaTypeTranslator from "./clientMetaTypeTranslator"
import ClientMetaValueViewer from "./ClientMetaValueViewer"
import ClientsHeader from "./header/ClientsHeader"
import fetchClients from "./fetchClients"
import LeadTr from "./LeadTr"
import SideModal from "@/components/SideModal/SideModal"
import { useForm, useFieldArray } from "react-hook-form"
import ClientFields from "./create/createClientForm/clientFields"
import { toast } from "react-toastify"

export default function Client(props: { searchParams: ClientsSearchInterface, defaultClients: ClientInterface[] }) {
    const [clients, setClients] = useState(props.defaultClients);

    useEffect(() => {
        let mount = true;
        (async function refreshData() {
            if (!mount) return;
            await new Promise(resolve => { setTimeout(() => { resolve(1); }, 1000); });
            const response = await fetchClients(props.searchParams);
            if (JSON.stringify(clients) !== JSON.stringify(response.clients)) {
                setClients(response.clients);
            }
            await refreshData();
        })();
        return () => { mount = false; }
    }, [clients, props.searchParams])

    return <>
        <h1>Клиенты</h1>
        <div className="mt-4">
            <ClientsHeader searchParams={props.searchParams} />
            <div className="my-5"></div>
            <table className="table  w-auto">
                <thead>
                    <tr className="sticky-top">
                        <th>ID</th>
                        <th>Наименование</th>
                        <th>Контакты</th>
                        <th>Адрес</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {clients.map((client, i) => <LeadTr key={client.id} client={client}>
                        <td>{client.id}</td>
                        <td>{client.full_name}</td>
                        <td>
                            <table className="w-100">
                                <tbody>
                                    {client.meta.map((meta) => <tr key={meta.id}>
                                        <td style={{ width: 50 }}>
                                            <span className="me-4">{clientMetaTypeTranslator[meta.data_type] || meta.data_type}</span>
                                        </td>
                                        <td className="text-left">
                                            <ClientMetaValueViewer type={meta.data_type} data={meta.data} />
                                        </td>
                                    </tr>)}
                                </tbody>
                            </table>
                        </td>
                        <td>{client.address}</td>
                        <td onClick={e => e.stopPropagation()}>
                            <div className="d-flex">
                                <div>
                                    <ClientEditor client={client} />
                                </div>
                            </div>
                        </td>
                    </LeadTr>)}
                </tbody>
            </table>
        </div>
    </>
}

function ClientEditor(props: { client: ClientInterface }) {
    const [is_open, setIsOpen] = useState(false);

    const defaultValues: any = {
        fio: props.client.full_name,
        address: props.client.address,
    }

    const meta = props.client.meta;

    const phones: any[] = [];
    const emails: any[] = [];
    const telegram: any[] = [];

    for (let index = 0; index < meta.length; index++) {
        const element = meta[index];
        if (element.data_type === "phone") {
            phones.push({ phone: element.data.replace(/^\+7/, "") });
        }
        if (element.data_type === "email") {
            emails.push({ email: element.data });
        }
        if (element.data_type === "telegram") {
            telegram.push({ telegram: element.data });
        }
    }
    if (phones.length) defaultValues.phones = phones;
    if (emails.length) defaultValues.emails = emails;
    if (telegram.length) defaultValues.telegram = telegram;

    const { register, handleSubmit, control, reset, setValue, getValues } = useForm<any>({
        defaultValues
    });
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


    return <>

        <button className="btn btn-outline-dark btn-sm text-nowrap" onClick={() => setIsOpen(true)}>Редактировать клиента</button>
        <SideModal isOpen={is_open} closeHandle={() => setIsOpen(false)}>
            <>
                <div className="d-flex align-items-center border-bottom px-4 py-3 ">
                    <h3>Редактировать клиента</h3>
                    <span className="ms-3 text-secondary" style={{ fontSize: "0.9em" }}>ID: {props.client.id}</span>
                </div>
                <div className="px-4">
                    <form
                        onSubmit={handleSubmit(e => onSubmit(e, props.client.id))}
                        style={{ maxWidth: "1000px" }}
                    >
                        <table className="table">
                            <tbody>
                                <tr>
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
                                </tr>
                            </tbody>
                        </table>
                        <button className="btn btn-primary">
                            Сохранить
                        </button>
                    </form>
                </div>
            </>
        </SideModal>
    </>
}

async function onSubmit(values: any, client_id: number) {
    fetch(
        `/api/clients/edit/${client_id}`,
        {
            method: "POST",
            body: JSON.stringify(values)
        }
    )
        .then(x => x.json())
        .then(x => {
            if(x.success){
                toast.success("Данные клиента изменены");
            }else{
                toast.error("Ошибка #mv773")
            }
        })
}
