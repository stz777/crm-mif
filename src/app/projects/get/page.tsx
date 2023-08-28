import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { getUserByToken } from "@/app/components/getUserByToken";
import { cookies } from "next/headers";
import { getProjectsFn } from "./getProjectsFn";
import Client from './client';
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
    const projects = await getProjectsFn(searchParams);
    return <>
        <Filter searchParams={searchParams} />
        <Client projects={projects} is_manager={!!user?.is_manager} is_boss={!!user.is_boss} searchParams={searchParams} />
    </>
}