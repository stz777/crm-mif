import { notFound, redirect } from 'next/navigation'
import getLead from "./getLead";
import getMessagesByLeadId from './getMessagesByLeadId';
import MessageForm from './messageForm';
import dayjs from 'dayjs';
import Chat from './chat';
import { getUserByToken } from '@/app/components/getUserByToken';
import { cookies } from 'next/headers';
import { getRoleByLeadId } from '../../get/getLeadsFn';
import getEmployeesByLeadId from './getEmployeesByLeadId';
import roleTranslator from '@/app/components/translate/roleTranslator';
import getClient from './getClient';
import getClentMeta from '@/app/db/clients/getClentMeta';
import { GenerateWALink } from './generateWALink';

export default async function Page({ params }: { params: { id: number } }) {
    const auth = cookies().get('auth');
    if (!auth?.value) return redirect("/");
    const user = await getUserByToken(auth?.value);
    if (!user) return redirect("/");

    const role = await getRoleByLeadId(params.id);

    if (!role) {
        return redirect("/");
    }

    const { id: leadId } = params;
    const lead = await getLead(leadId);

    if (!lead) return notFound();

    const employees = await getEmployeesByLeadId(lead.id);

    const messages = await getMessagesByLeadId(lead.id);

    const client = await getClient(lead.client);
    const clientMeta = await getClentMeta(Number(client?.id));

    return <>
        <h1>Заказ #{leadId}</h1>
        <table className='table table-bordered w-auto'>
            <tbody>
                <tr><td>номер</td><td>{lead.id}</td></tr>
                <tr><td>описание</td><td>{lead.description}</td></tr>
                <tr><td>стоимость заказа</td><td>{lead.sum} р</td></tr>
                <tr><td>дата создания</td><td>{dayjs(lead.created_date).format("DD.MM.YYYY")}</td></tr>
                <tr><td>дедлайн</td><td>{dayjs(lead.deadline).format("DD.MM.YYYY")}</td></tr>
                <tr><td>ответственные</td>
                    {!employees ? null : <table className='table'>
                        <tbody>
                            {employees.map(employee => <tr key={employee.id}>
                                <td>{employee.username}</td>
                                <td>{roleTranslator[employee.role]}</td>
                            </tr>)}
                        </tbody>
                    </table>}

                </tr>
                <tr>
                    <td>клиент</td>
                    <td>
                        <table>
                            <tbody>
                                <tr><td>id</td><td>{client?.id}</td></tr>
                                <tr><td>имя</td><td>{client?.full_name}</td></tr>
                                <tr><td>whatsapp</td><td>
                                    {(() => {
                                        const phoneItem = clientMeta.find(item => item.data_type === "phone");
                                        if (!phoneItem) return <>телефон не указан</>
                                        return <GenerateWALink phoneNumber={phoneItem.data} />;
                                    })()}</td></tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
        <MessageForm leadId={leadId} />
        <div className='mb-4'><Chat messages={messages || []} essense_type="lead" essense_id={lead.id} /></div>
    </>
}

