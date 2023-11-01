import { notFound, redirect } from 'next/navigation'
import { getUserByToken } from '@/app/components/getUserByToken';
import { cookies } from 'next/headers';
import getLeadFullData from '../../../db/leads/getLeadFullData/getLeadFullData';
import Client from './client';
import { getRoleByLeadId } from '../../get/getRoleByLeadId';

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

    const leadFullData = await getLeadFullData(leadId);

    if (!leadFullData?.lead) return notFound();

    const { lead, employees, messages, payments, expenses, client, clientMeta } = leadFullData;

    if (!client) return <>ОШИБКА #vm5i9v</>
    if (!employees) return <>ОШИБКА #vmC9v</>
    if(!leadFullData) return <>err #fjvfnd4</>

    return <>
        <h1>Заказ #{leadId}</h1>
        <Client
            lead_fullData={leadFullData}
            is_boss={!!user.is_boss}
        />
    </>
}
