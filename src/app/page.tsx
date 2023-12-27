import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserByToken } from "./components/getUserByToken";
import { getLeads } from "./leads/get/getLeadsFn";
import Client from "./leads/get/client";
import PageTmp from "./ui/tmp/page/PageTmp";
import ControlPanel from "@/components/clients/controlPanel/controlPanel";

export default async function Home(props: any) {
  const auth = cookies().get("auth");
  if (!auth?.value) return redirect("/");
  const user = await getUserByToken(auth?.value);
  if (!user) return redirect("/");
  const { searchParams } = props;
  const leads = await getLeads(searchParams);
 
  return (
    <>
      <PageTmp text="Заказы">
        <ControlPanel searchParams={searchParams}/>
        <div className="my-5"></div>
        <Client
          leads={leads}
          is_manager={!!user?.is_manager}
          is_boss={!!user.is_boss}
          searchParams={searchParams}
        />
      </PageTmp>
    </>
  );
}
