import { notFound } from 'next/navigation'
import getLead from "./getLead";
// import getClient from './getClient';
// import getEmployeesByLeadId from './getEmployeesByLeadId';
import getMessagesByLeadId from './getMessagesByLeadId';
import MessageForm from './messageForm';
// import AttachmentsArea from './AttachmentsArea';
import dayjs from 'dayjs';
import Chat from './chat';

export default async function Page({ params }: { params: { id: number } }) {
    const { id: leadId } = params;
    const lead = await getLead(leadId);

    if (!lead) return notFound();

    // const client = await getClient(lead.client);
    // const employees = await getEmployeesByLeadId(lead.id);

    const messages = await getMessagesByLeadId(lead.id);

    return <>
        <h1>Заказ #{leadId}</h1>
        <table className='table bable-cordered w-auto'>
            <tbody>
                <tr><td>номер</td><td>{lead.id}</td></tr>
                {/* <tr><td>заголовок</td><td>{lead.title}</td></tr> */}
                <tr><td>описание</td><td>{lead.description}</td></tr>
                <tr><td>дата создания</td><td>{dayjs(lead.created_date).format("DD.MM.YYYY")}</td></tr>
                <tr><td>дедлайн</td><td>{dayjs(lead.deadline).format("DD.MM.YYYY")}</td></tr>
            </tbody>
        </table>
        <MessageForm leadId={leadId} />
        <div className='mb-4'><Chat messages={messages || []} essense_type="lead"  essense_id={lead.id}/></div>
    </>
}
