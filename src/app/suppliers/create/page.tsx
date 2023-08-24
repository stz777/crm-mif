import { cookies } from "next/headers";
import CreateSupplierForm from "./createSupplierForm";
import { getUserByToken } from "@/app/components/getUserByToken";

export default async function Page() {
    const auth = cookies().get('auth');
    const user = await getUserByToken(String(auth?.value));
    if (!user) return null;
    if (!user.is_manager) return <>Нет прав</>

    return <>
        <h1>Создать поставщика</h1>
        <CreateSupplierForm />
    </>
}