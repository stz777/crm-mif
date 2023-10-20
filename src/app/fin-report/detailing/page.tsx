import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserByToken } from "../../components/getUserByToken";
import Client from "./client";

export default async function Page(props: { searchParams: { year: string, month: string } }) {
    const auth = cookies().get('auth');
    if (!auth?.value) return redirect("/");
    const user = await getUserByToken(auth?.value);
    if (!user) return redirect("/");
    if (!user.is_boss) return redirect("/");
    return <>
        <h1>Отчет (детализация)</h1>
        <Client searchParams={props.searchParams} />
    </>
}