import dayjs from 'dayjs'
import 'dayjs/locale/ru'

import Client from "./client";
import { getUserByToken } from "@/app/components/getUserByToken";
import { cookies } from "next/headers";
import { getLeads } from "./getLeadsFn";
import Filter from './filter';

dayjs.locale("ru");

export default async function Page(props: any) {
    const { searchParams } = props;
    const { lead_id } = searchParams
    const auth = cookies().get('auth');
    const user = await getUserByToken(String(auth?.value));
    const leads = await getLeads(searchParams);
    const is_boss = [1, 2].includes(Number(user?.id)); //FIXME сделать нормальную проверку на босса
    return <>
        <Filter searchParams={searchParams}/>
        <Client leads={leads} is_manager={!!user?.is_manager} is_boss={is_boss} searchParams={searchParams}/>
    </>
}
