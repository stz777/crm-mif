import { pool } from "../db/connect";
import { EmployeeInterface, SearchParamsInterface } from "./types";

export default async function getEmployeesFromDB(searchParams: SearchParamsInterface): Promise<EmployeeInterface[]> {
    const whereStrings: string[] = [];
    if (searchParams.id) whereStrings.push(
        String(searchParams.id)
    )

    return pool.promise().query("select * from employees ")
        .then(([x]: any) => x)
        .catch(error => {
            console.error('error #f64645', error);
            return [];
        })
}
