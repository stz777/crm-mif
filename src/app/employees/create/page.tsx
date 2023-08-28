import CreateEmployeeForm from "./createEmployeeForm";
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers'
import { getUserByToken } from "@/app/components/getUserByToken";

export default async function Page(props: any, chmops: any) {
    const auth = cookies().get('auth');
    if (!auth?.value) return redirect("/");
    const user = await getUserByToken(auth?.value);
    if (!user) return redirect("/");
    if (!user.is_boss) return redirect("/");
    return <>
        <h1>Создать сотрудника</h1>
        <CreateEmployeeForm />
    </>
}