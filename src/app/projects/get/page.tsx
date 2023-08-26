import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { getUserByToken } from "@/app/components/getUserByToken";
import { cookies } from "next/headers";
import { getProjectsFn } from "./getProjectsFn";
import Client from './client';
import Filter from './filter';
dayjs.locale("ru");

export default async function Page(props: any) {
    const { searchParams } = props;
    const { project_id } = searchParams
    const auth = cookies().get('auth');
    const user = await getUserByToken(String(auth?.value));
    const projects = await getProjectsFn(searchParams);
    const is_boss = [1, 2].includes(Number(user?.id)); //FIXME сделать нормальную проверку на босса
    return <>
        <Filter searchParams={searchParams} />
        <Client projects={projects} is_manager={!!user?.is_manager} is_boss={is_boss} searchParams={searchParams} />
    </>
}