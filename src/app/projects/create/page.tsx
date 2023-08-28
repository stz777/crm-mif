import { getUserByToken } from "@/app/components/getUserByToken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CreateProjectForm from "./createProjectForm";

export default async function Page() {
    const auth = cookies().get('auth');
    if (!auth?.value) return redirect("/");
    const user = await getUserByToken(auth?.value);
    if (!user) return redirect("/");
    if (!user.is_manager) return redirect("/");
    return <>
        <h1>Создать проект</h1>
        <CreateProjectForm />
    </>
}