import getClentMeta from "@/app/db/clients/getClentMeta";
import { getLeads } from "@/app/leads/get/getLeadsFn";
import getClient from "@/app/leads/single/[id]/getClient"

export default async function Page(props: { params: { id: number } }) {

    const client = await getClient(props.params.id);
    const meta = await getClentMeta(props.params.id);

    const leads = await getLeads({ client: props.params.id })

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
                            console.log('leads', leads);

                            const payments = leads
                                .filter(lead => lead.payments?.length)
                                .map(({ payments }) => {
                                    if (!payments) return 0;
                                    if (!payments.length) return 0;
                                    console.log('payments', payments);

                                    return payments.map(({ sum }) => sum).reduce((a, b) => a + b);
                                })
                                .reduce((a, b) => a + b);
                            return payments;
                        })()}
                    </td>
                </tr>
            </tbody>
        </table>
    </>
}