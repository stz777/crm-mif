import { pool } from "../db/connect";
import Client from "./client/client";
import PageTmp from "../ui/tmp/page/PageTmp";
import { EmployeeMeta, SearchParamsInterface } from "./types";
import getEmployeesFromDB from "./getEmployeesFromDB";

export default async function Page(params: { searchParams: SearchParamsInterface }) {
    const employees = await getEmployeesFromDB({});
    const employeesWithMeta = await Promise.all(
        employees.map(async employee => ({
            ...employee,
            meta: await getEmploeeMetaFromDB({})
        }))
    );
    return <>
        <PageTmp title="Сотрудники">
            {/* <Client /> */}
            <Client employeesWithMeta={employeesWithMeta} searchParams={params.searchParams} />
        </PageTmp>
    </>
}

async function getEmploeeMetaFromDB(searchParams: SearchParamsInterface): Promise<EmployeeMeta[]> {
    return pool.promise().query(
        "select * from employees_meta"
    )
        .then(([x]: any) => x)
        .catch(error => {
            console.error('error #kdd87', error);
            return [];
        })
}
