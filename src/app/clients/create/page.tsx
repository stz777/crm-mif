import { cookies } from "next/headers";
import CreateClientForm from "./createClientForm";
import { getUserByToken } from "@/app/components/getUserByToken";

export default async function Page(req: Request, res: Response) {
    const auth = cookies().get('auth');
    const user = await getUserByToken(String(auth?.value));
    if (!user) return null;
    if (!user.is_manager) return <>Нет прав</>


    return <>
        <h1>Создать клиента</h1>
        <CreateClientForm />
    </>
}