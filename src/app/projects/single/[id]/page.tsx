import { getProjectById } from "./getProjectById";
import Client from "./client";
import getMessages from "@/app/db/messages/getMessages";
import Chat from "@/app/components/chat/chat";

export default async function Page({ params }: { params: { id: number } }) {
    const { id } = params;
    const project = await getProjectById(id);
    const messages = await getMessages("project", id);
    return <>
        <Client project={project} />
        <Chat messages={messages} essense_type="project" essense_id={id} />
    </>
}
