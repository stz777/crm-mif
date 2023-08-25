import { getPurchaseTaskById } from "./getPurchaseTaskById";
import { getPurchasesByTaskId } from "./getPurchasesByTaskId";
import Client from "./client";

export default async function Page({ params }: { params: { task_id: number } }) {
    const { task_id } = params;
    const combinedPurchaseTaskData = await getPurchaseTaskData(task_id);
    return <Client combinedPurchaseTaskData={combinedPurchaseTaskData} />
}

async function getPurchaseTaskData(task_id: number) {
    const task = await getPurchaseTaskById(task_id);
    const purchases = await getPurchasesByTaskId(task_id);
    return {
        task,
        purchases,
    }
}