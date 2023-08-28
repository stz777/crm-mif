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
    if (!user.is_manager) return redirect("/");

    const { searchParams } = props;
    const { lead_id } = searchParams
    const leads = await getLeads(searchParams);
    const is_boss = [1, 2].includes(Number(user?.id)); //FIXME сделать нормальную проверку на босса
    return <>
        <Filter searchParams={searchParams}/>
        <Client leads={leads} is_manager={!!user?.is_manager} is_boss={is_boss} searchParams={searchParams}/>
    </>
}
