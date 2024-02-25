import PageTmp from "../ui/tmp/page/PageTmp";
import Client from "./client";
import getTasksFromDB from "../db/tasks/getTasksFromDB";

export default async function Page() {
    const tasks = await getTasksFromDB();
    return <PageTmp title="Задачи">
        <Client tasks={tasks} />
    </PageTmp>
}