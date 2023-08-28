import { cookies } from "next/headers";
import CreateClientForm from "./createClientForm";
import { getUserByToken } from "@/app/components/getUserByToken";
import { redirect } from "next/navigation";

export default async function Page(req: any, res: Response) {
    const auth = cookies().get('auth');
    if (!auth?.value) return redirect("/");
    const user = await getUserByToken(auth?.value);
    if (!user) return redirect("/");
    if (!user.is_manager) return redirect("/");

    return <>
        <h1>Создать клиента</h1>
        <CreateClientForm />
    </>
}