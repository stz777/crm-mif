import getClentMeta from "@/app/db/clients/getClentMeta";
import getClient from "@/app/leads/single/[id]/getClient"
import dayjs from "dayjs";
import Link from "next/link";
import { getLeadsByClientId } from "./getLeadsByClientId";

export default async function Page(props: { params: { id: number } }) {

    const client = await getClient(props.params.id);
    const meta = await getClentMeta(props.params.id);

    const leads = await getLeadsByClientId(props.params.id)

    if (!client) return <>тут никого нет</>

    return <>
        <h1>Клиент #{client?.id}</h1>
        <table className="table">
            <tbody>
                <tr><th>наименование</th><td>{client?.full_name}</td></tr>
                <tr><th>адрес</th><td>{client?.address}</td></tr>
                <tr>
                    <th>контакты</th>
                    <td>
                        <table>
                            <tbody>
                                {meta.map((item, i) => <tr key={i}>
                                    <td className="pe-2">{item.data_type}:</td>
                                    <td>{item.data}</td>
                                </tr>)}

                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr>
                    <th>сумма заказов</th>
                    <td>
                        {(() => {
                            if (!leads.length) return 0;
                            const payments = leads
                                .filter(lead => lead.payments?.length)
                                .map(({ payments }) => {
                                    if (!payments) return 0;
                                    if (!payments.length) return 0;
                                    return payments.map(({ sum }) => sum).reduce((a, b) => a + b);
                                })

                            if (!payments?.length) return 0;

                            return payments.reduce((a, b) => a + b);
                        })()}
                    </td>
                </tr>
            </tbody>
        </table>

        <h3>Заказы</h3>
        {leads ? <div>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Заказ</th>
                        <th>создан</th>
                        <th>дедлайн</th>
                        <th>срочность</th>
                        <th>описание</th>
                        <th>оплата</th>
                        <th>выполнен</th>
                    </tr>
                </thead>
                <tbody>
                    {leads.map(lead => <tr key={lead.id}>
                        <td><Link href={`/leads/single/${lead.id}`} className="text-nowrap">Заказ #{lead.id}</Link></td> {/*lead id*/}
                        <td>{dayjs(lead.created_date).format("DD.MM.YYYY")}</td>{/*created_date*/}
                        <td>{dayjs(lead.deadline).format("DD.MM.YYYY")}</td>{/*deadline*/}
                        <td>{(() => {
                            const date1 = dayjs(lead.deadline).set("hour", 0).set("minute", 0);
                            const date2 = dayjs().set("hour", 0).set("minute", 0);
                            const diffInDays = date1.diff(date2, 'day');
                            const limit = 1;
                            if (lead.done_at) return <span className="badge text-bg-success">выполнено</span>
                            if (diffInDays <= limit) return <span className="badge text-bg-danger">срочно</span>
                            if (diffInDays > limit) return <span className="badge text-bg-warning">в работе</span>
                            return <>{diffInDays}</>
                        })()}</td>
                        <td>{lead.description}</td>{/*description*/}
                        <td>{(() => {
                            const payments = lead.payments;
                            if (!payments?.length) return 0;
                            const sum = payments.map(({ sum }) => sum).reduce((a, b) => a + b);
                            return sum;
                        })()}</td>{/*description*/}
                        <td>
                            <span className="text-nowrap">{lead.done_at ? dayjs(lead.done_at).format("DD.MM.YYYY HH:mm") : "нет"}</span>
                        </td>
                    </tr>)}
                </tbody>
            </table>
        </div> : <>нет заказов...</>}
    </>
}