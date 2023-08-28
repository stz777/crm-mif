import { getProjectById } from "./getProjectById";
import Client from "./client";
import getMessages from "@/app/db/messages/getMessages";
import Chat from "@/app/components/chat/chat";
import { getUserByToken } from "@/app/components/getUserByToken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: number } }) {
    const auth = cookies().get('auth');
    if (!auth?.value) return redirect("/");
    const user = await getUserByToken(auth?.value);
    if (!user) return redirect("/");
    if (!user.is_manager) return redirect("/");
   
    const { id } = params;
    const project = await getProjectById(id);
    const messages = await getMessages("project", id);
    return <>
        <Client project={project} />
        <Chat messages={messages} essense_type="project" essense_id={id} />
    </>
}
