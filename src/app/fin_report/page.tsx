import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserByToken } from "../components/getUserByToken";
import Client from "./client";
import getFinReportdata from "./getFinReportdata";
import Filter from "./filter";

export default async function Page(props: { searchParams: ReportSearchInterface }) {
    const auth = cookies().get('auth');
    if (!auth?.value) return redirect("/");
    const user = await getUserByToken(auth?.value);
    if (!user) return redirect("/");
    if (!user.is_boss) return redirect("/");

    const data = await getFinReportdata(props.searchParams);
    return <>
        <Filter searchParams={props.searchParams} />
        <Client reportData={data} searchParams={props.searchParams} />
    </>
}

export interface ReportSearchInterface {
    year: number
}