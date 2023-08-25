import { getEmployees } from "./getEmployeesFn";
import Client from "./client";

export default async function Page() {
    const employees = await getEmployees();
    return <Client employees={employees} />
}
