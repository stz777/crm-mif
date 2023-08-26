import { getPurchaseTaskById } from "./getPurchaseTaskById";
import { getPurchasesByTaskId } from "./getPurchasesByTaskId";
import Client from "./client";
import getMessagesByTaskId from "./getMessagesByTaskId";
import Chat from "@/app/leads/single/[id]/chat";

export default async function Page({ params }: { params: { task_id: number } }) {
    const { task_id } = params;
    const combinedPurchaseTaskData = await getPurchaseTaskData(task_id);

    const messages = await getMessagesByTaskId(params.task_id);

    return <>
        <Client combinedPurchaseTaskData={combinedPurchaseTaskData} />
        <Chat messages={messages} essense_type="purchase_task" essense_id={task_id} />
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