import dayjs from 'dayjs'
import 'dayjs/locale/ru'

import Client from "./client";
import { getUserByToken } from "@/app/components/getUserByToken";
import { cookies } from "next/headers";
import { getLeads } from "./getLeadsFn";

dayjs.locale("ru");

export default async function Page() {
    const auth = cookies().get('auth');
    const user = await getUserByToken(String(auth?.value));
    const leads = await getLeads();
    const is_boss = [1, 2].includes(Number(user?.id));
    return <>
        <Client leads={leads} is_manager={!!user?.is_manager} is_boss={is_boss} />
    </>
}
