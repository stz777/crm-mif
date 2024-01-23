import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserByToken } from "../../components/getUserByToken";
import getFinReportdata from "./getFinReportdata";
import Client from "./client";

export default async function Page(props: { searchParams: any }) {
    const auth = cookies().get('auth');
    if (!auth?.value) return redirect("/");
    const user = await getUserByToken(auth?.value);
    if (!user) return redirect("/");
    if (!user.is_boss) return redirect("/");
    const data = await getFinReportdata(props.searchParams);
    return <>
        <Client reportData={data} searchParams={props.searchParams} />
    </>
}