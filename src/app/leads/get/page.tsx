import dayjs from 'dayjs'
import 'dayjs/locale/ru'

import Client from "./client";
import { getUserByToken } from "@/app/components/getUserByToken";
import { cookies } from "next/headers";
import { getLeads } from "./getLeadsFn";
import Filter from './filter';
import { redirect } from 'next/navigation';

dayjs.locale("ru");

export default async function Page(props: any) {
    const auth = cookies().get('auth');
    if (!auth?.value) return redirect("/");
    const user = await getUserByToken(auth?.value);
    if (!user) return redirect("/");

    const { searchParams } = props;
    const { lead_id } = searchParams
    const leads = await getLeads(searchParams);
    return <>
        <h1>Заказы</h1>
        <Filter searchParams={searchParams} />
        <Client leads={leads} is_manager={!!user?.is_manager} is_boss={!!user.is_boss} searchParams={searchParams} />
    </>
}
