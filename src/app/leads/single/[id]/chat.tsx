"use client"

import AttachmentsArea from "./AttachmentsArea";
import { MessageInterface } from "./getMessagesByLeadId";

export default function Chat({ messages }: { messages: MessageInterface[] }) {
    return <>
        <div className="card">
            <div className="card-header">
                <h5 className="card-title h2">Чат</h5>
            </div>
            <div className="card-body">
                {messages.map(message =>
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