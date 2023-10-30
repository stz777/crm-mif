import { getPurchaseTaskById } from "./getPurchaseTaskById";
import { getPurchasesByTaskId } from "./getPurchasesByTaskId";
import Client from "./client";
import getMessagesByTaskId from "./getMessagesByTaskId";
import Chat from "@/app/leads/single/[id]/chat";
import { getUserByToken } from "@/app/components/getUserByToken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import get_all_materials from "@/app/db/materials/get_all_materials";
import getEmployeesByPurchaseTask from "@/app/db/employees/getEmployeesByPurchaseTask";

export default async function Page({ params }: { params: { task_id: number } }) {
    const auth = cookies().get('auth');
    if (!auth?.value) return redirect("/");
    const user = await getUserByToken(auth?.value);
    if (!user) return redirect("/");
    if (!user.is_manager) return redirect("/");

    const { task_id } = params;
    const combinedPurchaseTaskData = await getPurchaseTaskData(task_id);

    const messages = await getMessagesByTaskId(params.task_id);

    const materials = await get_all_materials();

    const employees = await getEmployeesByPurchaseTask(params.task_id);

    return <>
        <Client combinedPurchaseTaskData={combinedPurchaseTaskData} materials={materials} employees={employees} messages={messages} />

    </>
}

export async function getPurchaseTaskData(task_id: number) {
    const task = await getPurchaseTaskById(task_id);
    const purchases = await getPurchasesByTaskId(task_id);
    return {
        task,
        purchases,
    }
}