import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserByToken } from "../components/getUserByToken";
import Client from "./client";
import getFinReportdata from "./getFinReportdata";

export default async function Page() {
    const auth = cookies().get('auth');
    if (!auth?.value) return redirect("/");
    const user = await getUserByToken(auth?.value);
    if (!user) return redirect("/");
    if (!user.is_boss) return redirect("/");

    const data = await getFinReportdata();
    return <Client reportData={data} />

}