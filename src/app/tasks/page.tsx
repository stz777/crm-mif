import PageTmp from "../ui/tmp/page/PageTmp";
import Client from "./client";
import getTasksFromDB from "../db/tasks/getTasksFromDB";
import { SearchInterface } from "./types";

export default async function Page(params: { searchParams: SearchInterface }) {
    const tasks = await getTasksFromDB();
    return <PageTmp title="Задачи">
        <Client tasks={tasks} searchParams={params.searchParams} />
    </PageTmp>
}