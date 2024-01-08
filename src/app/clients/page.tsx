import { getUserByToken } from "@/app/components/getUserByToken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getClients } from "./getClients";
import { ClientsSearchInterface } from "@/app/components/types/clients";
import Client from "./client";

export default async function Page(props: { searchParams: ClientsSearchInterface }) {
    const auth = cookies().get('auth');
    if (!auth?.value) return redirect("/");
    const user = await getUserByToken(auth?.value);
    if (!user) return redirect("/");
    if (!user.is_manager) return redirect("/");
    const clients = await getClients(props.searchParams);
    return <>
        <Client searchParams={props.searchParams} defaultClients={clients} />
    </>
}
