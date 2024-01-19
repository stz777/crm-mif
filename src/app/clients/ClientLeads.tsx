import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { LeadInterface } from "../components/types/lead";
import fetchClientLeads from "./fetchClientLeads";

export default function ClientLeads(props: { client_id: number }) {
    const [leads, setLeads] = useState<LeadInterface[] | undefined>();

    useEffect(() => {
        let mount = true;
        (async function refreshData() {
            if (!mount) return;
            await new Promise(resolve => { setTimeout(() => { resolve(1); }, 1000); });
            const response = await fetchClientLeads(props.client_id);
            if (JSON.stringify(leads) !== JSON.stringify(response.leads)) {
                setLeads(response.leads);
            }
            await refreshData();
        })();
        return () => { mount = false; }
    }, [leads])

    if (!leads) return <>Загрузка...</>;
    if (!leads.length) return <>Нет заказов</>

    return <>
        <table className="table">
            <thead>
                <tr>
                    <th className="text-secondary">ID</th>
                    <th className="text-secondary">Описание</th>
                    <th className="text-secondary">Создан</th>
                    <th className="text-secondary">Сумма ₽</th>
                </tr>
            </thead>
            <tbody>
                {leads.map(lead => <tr key={lead.id}>
                    <td>{lead.id}</td>
                    <td>{lead.description}</td>
                    <td>{dayjs(lead.created_date).format("DD.MM.YYYY")}</td>
                    <td>{lead.sum}</td>
                </tr>)}
                <tr>
                    <th>Всего</th>
                    <td></td>
                    <td></td>
                    <td>{leads.map(({ sum }) => sum).reduce((a, b) => a + b)}</td>
                </tr>
            </tbody>
        </table>
    </>
}