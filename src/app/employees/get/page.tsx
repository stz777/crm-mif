import { getEmployees } from "./getEmployeesFn";
import Client from "./client";

export default async function Page(props: any) {
    const { searchParams } = props;
    const is_active = Number(searchParams.is_active) === 0 ? 0 : 1;
    const employees = await getEmployees({
        is_active
    });
    return <Client employees={employees} searchParams={{ is_active: is_active }} />
}
