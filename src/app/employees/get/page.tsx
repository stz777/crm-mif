import { getEmployees } from "./getEmployeesFn";
import Client from "./client";
import { getUserByToken } from "@/app/components/getUserByToken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page(props: any) {

    const auth = cookies().get('auth');
    if (!auth?.value) return redirect("/");
    const user = await getUserByToken(auth?.value);
    if (!user) return redirect("/");
    if (!user.is_manager) return redirect("/");

    const { searchParams } = props;
    const is_active = Number(searchParams.is_active) === 0 ? 0 : 1;
    const employees = await getEmployees({
        is_active
    });
    return <Client employees={employees} searchParams={{ is_active: is_active }} />
}
