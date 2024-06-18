import Client from "./client/client";
import PageTmp from "../ui/tmp/page/PageTmp";
import { SearchParamsInterface } from "./types";
import getEmployeesFromDB from "@/app/db/employees/getEmployeesFromDB";
import getEmploeeMetaFromDB from "../db/employees/getEmploeeMetaFromDB";
import { cookies } from "next/headers";
import { getUserByToken } from "../components/getUserByToken";

export default async function Page(params: { searchParams: SearchParamsInterface }) {
    const auth = cookies().get('auth');
    if (!auth?.value) return;
    const user = await getUserByToken(auth?.value);
    if (!user) return null;
    if (!user.is_boss) return null;

    const employees = await getEmployeesFromDB({});
    const employeesWithMeta = await Promise.all(
        employees.map(async employee => ({
            ...employee,
            meta: await getEmploeeMetaFromDB(employee.id)
        }))
    );
    return <>
        <PageTmp title="Сотрудники">
            <Client employeesWithMeta={employeesWithMeta} searchParams={params.searchParams} />
        </PageTmp>
    </>
}
