import { notFound } from 'next/navigation'
import getLead from "./getLead";
import getClient from './getClient';
import getEmployeesByLeadId from './getEmployeesByLeadId';
import getMessagesByLeadId, { Media, Message } from './getMessagesByLeadId';
import MessageForm from './messageForm';
import AttachmentsArea from './AttachmentsArea';

export default async function Page({ params }: { params: { id: number } }) {
    const { id: leadId } = params;
    const lead = await getLead(leadId);

    if (!lead) return notFound();

    const client = await getClient(lead.client);
    const employees = await getEmployeesByLeadId(lead.id);

    const messages = await getMessagesByLeadId(lead.id);

    return <>
        <h1>Заказ #{leadId}</h1>
        {/* <pre>{JSON.stringify({ lead, client, employees, messages }, null, 2)}</pre> */}
        <MessagesArea messages={messages || []} />
        <MessageForm leadId={leadId} />
    </>
}

function MessagesArea({ messages }: { messages: Message[] }) {
    return <>
        <div className="card">
            <div className="card-header">
                <h5 className="card-title h2">Чат</h5>
            </div>
            <div className="card-body">
                {messages.map(message =>
                    <div key={message.id} className='border border-dsrk mb-5 p-1' style={{ maxWidth: "400px" }}>
                        <div className="text-dark">{message.username}</div>
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



