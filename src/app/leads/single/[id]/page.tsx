import { notFound } from 'next/navigation'
import getLead from "./getLead";
import getClient from './getClient';
import getEmployeesByLeadId from './getEmployeesByLeadId';
import getMessagesByLeadId from './getMessagesByLeadId';
import MessageForm from './messageForm';

export default async function Page({ params }: { params: { id: number } }) {
    const { id: leadId } = params;
    const lead = await getLead(leadId);

    if (!lead) return notFound();

    const client = await getClient(lead.client);
    const employees = await getEmployeesByLeadId(lead.id);

    const messages = await getMessagesByLeadId(lead.id);

    return <>
        <h1>Заказ #{leadId}</h1>
        <pre>{JSON.stringify({ lead, client, employees, messages }, null, 2)}</pre>
        <MessageForm />
    </>
}

