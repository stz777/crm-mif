import PageTmp from "../ui/tmp/page/PageTmp";
import Client from "./client";

export default async function Page() {
    return <PageTmp title="Задачи">
        <Client />
    </PageTmp>
}