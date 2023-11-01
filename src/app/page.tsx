import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserByToken } from "./components/getUserByToken";
import { getLeads } from "./leads/get/getLeadsFn";
import Filter from "./purchasing_tasks/get/filter";
import Client from "./leads/get/client";

export default async function Home(props: any) {
  const auth = cookies().get('auth');
  if (!auth?.value) return redirect("/");
  const user = await getUserByToken(auth?.value);
  if (!user) return redirect("/");

  const { searchParams } = props;
  const leads = await getLeads(searchParams);
  if (!leads?.length) return <>нет заказов</>
  return <>
    <h1>Заказы</h1>
    <Filter searchParams={searchParams} />
    <Client leads={leads} is_manager={!!user?.is_manager} is_boss={!!user.is_boss} searchParams={searchParams} />
  </>
}
