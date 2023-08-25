"use client"

import { useEffect, useState } from "react";
import AttachmentsArea from "./AttachmentsArea";
import { MessageInterface } from "./getMessagesByLeadId";
import { toast } from "react-toastify";
import dayjs from "dayjs";

export default function Chat(props: { messages: MessageInterface[], essense_type: "lead" | "something_else", essense_id: number }) {
    const [stateMessages, setStateMessages] = useState(props.messages);
    useEffect(() => {
        let mounted = true;
        (async function updateChat() {
            if (!mounted) return;
            const newMessages = await fetchGetMessages(props.essense_type, props.essense_id);
            setStateMessages(newMessages);
            setTimeout(() => {
                updateChat();
            }, 2000);
        })()
        return () => { mounted = false; }
    }, [props])
    return <>
        <div className="card">
            <div className="card-body">
                {stateMessages.map(message =>
                    <div key={message.id} className='border border-dsrk mb-5 p-1' style={{ maxWidth: "400px" }}>
                        <div className="text-dark fw-bold">{message.username}</div> {/*username*/}
                        <div className="">{dayjs(message.created_date).format("DD.MM.YYYY HH.mm")}</div> {/*username*/}
                        <pre
                            style={{
                                fontSize: "inherit", marginBottom: "0"
                            }}
                        >{message.text}</pre>
                        <AttachmentsArea attachments={message.attachments} />
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