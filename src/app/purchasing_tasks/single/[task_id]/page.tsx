import { getPurchaseTaskById } from "./getPurchaseTaskById";
import { getPurchasesByTaskId } from "./getPurchasesByTaskId";
import Client from "./client";
import getMessagesByTaskId from "./getMessagesByTaskId";

export default async function Page({ params }: { params: { task_id: number } }) {
    const { task_id } = params;
    const combinedPurchaseTaskData = await getPurchaseTaskData(task_id);

    const messages = await getMessagesByTaskId(params.task_id);


    return <>
        <Client combinedPurchaseTaskData={combinedPurchaseTaskData} />
        <pre>{JSON.stringify(messages, null, 2)}</pre>
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