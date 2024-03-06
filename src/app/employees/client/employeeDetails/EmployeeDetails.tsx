import { useEffect, useState } from "react";
import { EmployeeInterface } from "../../types";
import Wrapper from "./Wrapper";
import fetchGetLeadsByEmployeeId from "./fetchLeads";
import { LeadsByEmployeeInterface } from "@/app/api/employees/get-leads/[employeeId]/route";
import dayjs from "dayjs";

export function EmployeeDetails(props: { employee: EmployeeInterface }) {
    return <>
        <div className="d-flex align-items-center border-bottom px-4 py-3 ">
            <div className="h3">Детали задачи</div>
            <span className="ms-3 text-secondary" style={{ fontSize: "0.9em" }}>ID: {props.employee.id}</span>
        </div>
        <div className="px-4">
            <div><Wrapper title="ФИО">{props.employee.username}</Wrapper></div>
            <div><Wrapper title="Должность">{(() => {
                if (props.employee.is_boss) return <>Босс</>
                if (props.employee.is_manager) return <>Менеджер</>
                return "должность не установлена";
            })()}</Wrapper></div>
            <div><Wrapper title="Контакты">
                <table>
                    <tbody>
                        <tr><td className="pe-2">telegram:</td><td>{props.employee.telegram_id}</td></tr>
                        {props.employee.meta?.map(metaItem => <tr key={metaItem.id} className="my-2">
                            <td>{metaItem.data_type}:</td><td>{metaItem.data}</td>
                        </tr>)}
                    </tbody>
                </table>
            </Wrapper></div>
            <h4>Заказы в работе</h4>
            <LeadsByEmployee employeeId={props.employee.id} />
        </div>
    </>
}

function LeadsByEmployee(props: { employeeId: number }) {
    const [leads, setLeads] = useState<undefined | LeadsByEmployeeInterface[]>();
    useEffect(() => {
        (async () => {
            const responsedLeads = await fetchGetLeadsByEmployeeId(props.employeeId);
            if (responsedLeads) setLeads(responsedLeads)
        })();
    }, [])
    if (!leads) return "Загрузка..."
    return <>
        <table className="table table-borderless">
            <thead>
                <tr>
                    <th className="text-secondary">ID</th>
                    <th className="text-secondary">Описание</th>
                    <th className="text-secondary">Создан</th>
                    <th className="text-secondary">Оплата, ₽</th>
                </tr>
            </thead>
            <tbody>
                {leads.map(lead => <tr key={lead.id}>
                    <td>{lead.id}</td>
                    <td>{lead.description}</td>
                    <td>{dayjs(lead.create_date).format("DD.MM.YYYY")}</td>
                    <td>
                        <div className={`text-nowrap ${lead.payments === lead.sum ? "text-success" : ""}`}>
                            {lead.sum}/{lead.payments}
                        </div>
                    </td>
                </tr>)}
            </tbody>
        </table>
    </>
}