import getEployeeByID from "@/app/db/employees/getEployeeById";
import getLeadsByEmployeeId from "@/app/db/leads/getLeadsByEmployeeId";
import dayjs from "dayjs";
import Link from "next/link";

export default async function Page(props: { params: { id: number } }) {
    const employee = await getEployeeByID(props.params.id)
    const leads = await getLeadsByEmployeeId(props.params.id);
    return <>
        <h1>Сотрудник {props.params.id} </h1>
        <table className="table">
            <tbody>
                <tr><th>Имя</th><td>{employee.username}</td></tr>
                <tr><th>Должность</th><td>{employee.is_manager ? "менеджер" : "исполнитель"}</td></tr>
                <tr>
                    <th>Заказы в работе</th>
                    <td>
                        <div className="overflow-auto" style={{ maxHeight: 200 }}>
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Номер заказа</th>
                                        <th>Описание</th>
                                        <th>Дата создания</th>
                                        <th>Дедлайн</th>
                                        <th>Завершен</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        leads.map((lead, i) => <tr key={lead.id}>
                                            <td>{i + 1}</td>
                                            <td><Link href={`/leads/single/${lead.id}`}>{lead.id}</Link></td>
                                            <td>{lead.description}</td>
                                            <td>{dayjs(lead.created_date).format("DD.MM.YYYY")}</td>
                                            <td>{dayjs(lead.deadline).format("DD.MM.YYYY")}</td>
                                            <td>{lead.done_at ? dayjs(lead.deadline).format("DD.MM.YYYY") : "-"}</td>
                                        </tr>)
                                    }
                                </tbody>
                            </table>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <h3>Заказы</h3>
    </>
}