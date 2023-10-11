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
import Link from 'next/link';
import { RightsManagement } from '../../get/righsManagement/rightsManagement';
import { Add_Payment } from '../../get/add_payment';
import ConfirmPayment from '../../get/confirmPayment';
import DeclinePayment from '../../get/declinePayment';
import { FaCheck } from 'react-icons/fa';
import { getPaymentsByLeadId } from '@/app/db/payments_by_lead/getPaymentsByLeadId';
import { AddExpense } from '../../get/addExpense';
import getExpensesByLeadId from '../../get/getExpensesByLeadId';
import Comment from '../../get/Comment';

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
    const payments = await getPaymentsByLeadId(lead.id);
    const expenses = await getExpensesByLeadId(leadId);
    const client = await getClient(Number(lead.client));
    const clientMeta = await getClentMeta(Number(client?.id));
    return <>
        <h1>Заказ #{leadId}</h1>
        <div className="container-fluid">
            <div className="row">
                <div className="col">
                    <div className="card">
                        <div className="card-header">
                            <h3>Детали заказа</h3>
                        </div>
                        <div className="card-body">
                            <table className='table table-bordered w-auto'>
                                <tbody>
                                    <tr><td>номер</td><td>{lead.id}</td></tr>
                                    <tr><td>описание</td><td>{lead.description}</td></tr>
                                    <tr>
                                        <td>комментарий</td>
                                        <td>
                                            <Comment currentText={lead.comment} lead_id={leadId} />
                                        </td>
                                    </tr>
                                    <tr><td>стоимость заказа</td><td><span className='fw-bold'>{lead.sum} р</span></td></tr>
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
                                        <td>настроить права</td>
                                        <td><RightsManagement
                                            leadId={leadId}
                                            is_boss={!!user.is_boss}
                                        /></td>
                                    </tr>

                                    <tr>
                                        <td>
                                            срочность
                                        </td>
                                        <td>
                                            {(() => {
                                                const date1 = dayjs(lead.deadline).set("hour", 0).set("minute", 0);
                                                const date2 = dayjs().set("hour", 0).set("minute", 0);
                                                const diffInDays = date1.diff(date2, 'day');
                                                const limit = 1;

                                                if (lead.done_at) return <span className="badge text-bg-success">выполнено</span>
                                                if (diffInDays <= limit) return <span className="badge text-bg-danger">срочно</span>
                                                if (diffInDays > limit) return <span className="badge text-bg-warning">в работе</span>

                                                return <>{diffInDays}</>
                                            })()}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>клиент</td>
                                        <td>
                                            <table>
                                                <tbody>
                                                    <tr><td>id</td><td>
                                                        <Link href={`/clients/get/${client?.id}`}>{client?.id}</Link>
                                                    </td></tr>
                                                    <tr><td>имя</td><td>{client?.full_name}</td></tr>
                                                    <tr><td><span className='pr-3'>
                                                        whatsapp
                                                    </span></td><td>
                                                            {(() => {
                                                                const phoneItem = clientMeta.find(item => item.data_type === "phone");
                                                                if (!phoneItem) return <>телефон не указан</>
                                                                return <GenerateWALink phoneNumber={phoneItem.data} />;
                                                            })()}</td></tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card">
                        <div className="card-header">
                            <h3>Оплаты</h3>
                        </div>
                        <div className="card-body">
                            <ul className="list-group">
                                {payments?.map(payment =>
                                    <li key={payment.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>{payment.sum}</div>
                                        <div>{!payment.confirmed ? <div className="d-flex ms-2">
                                            <ConfirmPayment paymentId={payment.id} />
                                            <DeclinePayment paymentId={payment.id} />
                                        </div> : <><FaCheck color="green" /></>}</div>
                                    </li>)}

                                <li className="list-group-item">{(() => {
                                    let totalSum = 0;
                                    if (payments?.length) {
                                        totalSum = payments
                                            .map(({ sum }) => sum)
                                            .reduce((a, b) => a + b);
                                    }
                                    return <div className="fw-bold">Σ {totalSum}</div>
                                })()}</li>
                            </ul>
                            <Add_Payment lead_id={leadId} is_boss={!!user.is_boss} />
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card">
                        <div className="card-header">
                            <h3>Расходы</h3>
                        </div>
                        <div className="card-body">
                            <ul className="list-group">
                                {expenses?.map(expense =>
                                    <li key={expense.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>{expense.sum}</div>
                                        <div>{expense.comment}</div>
                                    </li>)}

                                <li className="list-group-item">
                                    {(() => {
                                        let totalSum = 0;
                                        if (expenses?.length) {
                                            totalSum = expenses
                                                .map(({ sum }) => sum)
                                                .reduce((a, b) => a + b);
                                        }
                                        return <>
                                            <div className="fw-bold">Σ {totalSum}</div>
                                        </>
                                    })()}</li>
                            </ul>
                            <AddExpense lead_id={leadId} />
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card">
                        <div className="card-header">
                            <h3>Чат</h3>
                        </div>
                        <div className="card-body">
                            <MessageForm leadId={leadId} />
                            <div className='mb-4'><Chat messages={messages || []} essense_type="lead" essense_id={lead.id} /></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

