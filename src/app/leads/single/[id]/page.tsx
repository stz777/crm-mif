import { notFound } from 'next/navigation'
import getLead from "./getLead";
import getClient from './getClient';
import getEmployeesByLeadId from './getEmployeesByLeadId';
import getMessagesByLeadId, { Media, Message } from './getMessagesByLeadId';
import MessageForm from './messageForm';
import AttachmentsArea from './AttachmentsArea';
import dayjs from 'dayjs';

export default async function Page({ params }: { params: { id: number } }) {
    const { id: leadId } = params;
    const lead = await getLead(leadId);

    if (!lead) return notFound();

    const client = await getClient(lead.client);
    const employees = await getEmployeesByLeadId(lead.id);

    const messages = await getMessagesByLeadId(lead.id);

    return <>
        <h1>Заказ #{leadId}</h1>
        <table className='table bable-cordered w-auto'>
            <tbody>
                <tr><td>номер</td><td>{lead.id}</td></tr>
                <tr><td>заголовок</td><td>{lead.title}</td></tr>
                <tr><td>описание</td><td>{lead.description}</td></tr>
                <tr><td>дата создания</td><td>{dayjs(lead.created_date).format("DD.MM.YYYY")}</td></tr>
                <tr><td>дедлайн</td><td>{dayjs(lead.deadline).format("DD.MM.YYYY")}</td></tr>
            </tbody>
        </table>
        <div className='mb-4'><MessagesArea messages={messages || []} /></div>
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



