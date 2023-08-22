"use client"

import { useEffect, useState } from "react";
import AttachmentsArea from "./AttachmentsArea";
import { MessageInterface } from "./getMessagesByLeadId";
import { toast } from "react-toastify";

export default function Chat(props: { messages: MessageInterface[], essense_type: "lead" | "something_else", essense_id: number }) {
    const [stateMessages, setStateMessages] = useState(props.messages);
    useEffect(() => {
        (async function updateChat() {
            await fetch(
                "/api/messages/get",
                {
                    method: "POST",
                    body: JSON.stringify({
                        essense: props.essense_type,
                        essense_id: props.essense_id,
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
                    // console.log(data.messages);
                    setStateMessages(data.messages);
                } else {
                    toast.error("Что-то пошло не так #cjcds4j");
                }
            })
                .catch(error => {
                    toast.error("Что-то пошло не так #ncdsj4dn");
                });
            setTimeout(() => {
                updateChat();
            }, 2000);
            // await updateChat();
        })()
        // setInterval(() => {
        //     console.log('update');
        //     fetch()
        // }, 2000)
    }, [props])
    return <>
        <div className="card">
            <div className="card-header">
                <h5 className="card-title h2">Чат</h5>
            </div>
            <div className="card-body">
                {stateMessages.map(message =>
                    <div key={message.id} className='border border-dsrk mb-5 p-1' style={{ maxWidth: "400px" }}>
                        <div className="text-dark fw-bold">{message.username}</div>
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