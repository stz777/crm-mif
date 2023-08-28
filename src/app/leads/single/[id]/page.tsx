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

    return <>
        <h1>Заказ #{leadId}</h1>
        <table className='table table-bordered w-auto'>
            <tbody>
                <tr><td>номер</td><td>{lead.id}</td></tr>
                <tr><td>описание</td><td>{lead.description}</td></tr>
                <tr><td>дата создания</td><td>{dayjs(lead.created_date).format("DD.MM.YYYY")}</td></tr>
                <tr><td>дедлайн</td><td>{dayjs(lead.deadline).format("DD.MM.YYYY")}</td></tr>
                <tr><td>ответстенные</td>
                    {!employees ? null : <table className='table'>
                        <tbody>
                            {employees.map(employee => <tr key={employee.id}>
                                <td>{employee.username}</td>
                                <td>{roleTranslator[employee.role]}</td>
                            </tr>)}
                        </tbody>
                    </table>}

                    {/* <td>
                        <pre>{JSON.stringify(employees, null, 2)}</pre>
                    </td> */}
                </tr>
            </tbody>
        </table>
        <MessageForm leadId={leadId} />
        <div className='mb-4'><Chat messages={messages || []} essense_type="lead" essense_id={lead.id} /></div>
    </>
}
