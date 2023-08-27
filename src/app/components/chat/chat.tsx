"use client"

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { MessageForChatInterface } from "../types/messages";
import AttachmentsArea from "./AttachmentsArea";
import { EssenseName } from "../types/essenses";

export default function Chat(props: { messages: MessageForChatInterface[], essense_type: EssenseName, essense_id: number }) {
    const [stateMessages, setStateMessages] = useState(props.messages);
    useEffect(() => {
        let mounted = true;
        (async function updateChat() {
            if (!mounted) return;
            const newMessages = await fetchGetMessages(props.essense_type, props.essense_id);
            if (JSON.stringify(stateMessages) !== JSON.stringify(newMessages)) setStateMessages(newMessages);
            setTimeout(() => {
                updateChat();
            }, 2000);
        })()
        return () => { mounted = false; }
    }, [props, stateMessages])


    return <>
        <div className="card">
            <div className="card-body">
                {stateMessages.map(messageObject =>
                    <div key={messageObject.message.id} className='border border-dsrk mb-5 p-1' style={{ maxWidth: "400px" }}>

                        <div className="d-flex justify-content-between">
                            <div className="text-dark fw-bold">
                                {messageObject.employee.username} ({roleTranslator[messageObject.employeeRoleInEssense.role] || JSON.stringify(messageObject.employeeRoleInEssense.role)})
                            </div> {/*username*/}
                            <div className="ms-4 text-nowrap">{dayjs(messageObject.message.created_date).format("DD.MM.YYYY HH.mm")}</div> {/*username*/}
                        </div>


                        <pre
                            style={{
                                fontSize: "inherit", marginBottom: "0"
                            }}
                        >{messageObject.message.text}</pre>
                        <AttachmentsArea attachments={messageObject.media} />
                    </div>)}
            </div>
        </div>
    </>
}

async function fetchGetMessages(essense: string, essense_id: number) {
    return await fetch(
        "/api/messages/get",
        {
            method: "POST",
            body: JSON.stringify({
                essense,
                essense_id
            })
        }
    ).then(
        response => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error(response.statusText);
            }
        }
    ).then((data: any) => {
        if (data.success) {
            if (data.messages) {
                return data.messages;
            } else {
                toast.error("Что-то пошло не так #dmcdsdf9");
            }
        } else {
            toast.error("Что-то пошло не так #cjcds4j");
        }
    })
        .catch(_ => {
            toast.error("Что-то пошло не так #ncdsj4dn");
        });
}


export const roleTranslator: any = {
    inspector: "Контроллер",
    executor: "Исполнитель",
    viewer: "Наблюдатель",
}