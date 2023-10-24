import { getUserByToken } from "@/app/components/getUserByToken";
import getMessagesByLeadId from "@/app/db/leads/getLeadFullData/getMessagesByLeadId";
import getMessages from "@/app/db/messages/getMessages";
import getMessagesByTaskId from "@/app/purchasing_tasks/single/[task_id]/getMessagesByTaskId";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    // { params }: { params: { id: number } }
) {

    const auth = cookies().get('auth');
    if (!auth?.value) return new Response("Кто ты", { status: 401, });;
    const user = await getUserByToken(auth?.value);
    if (!user) return new Response("Кто ты", { status: 401, });;
    // if (!user.is_manager) return new Response("Кто ты", { status: 401, });;


    const { essense, essense_id } = await request.json();
    if (essense === "lead") {
        const messages = await getMessagesByLeadId(essense_id);
        if (messages) {
            return NextResponse.json({
                success: true,
                messages
            });
        }
    }
    if (essense === "purchase_task") {
        const messages = await getMessagesByTaskId(essense_id);
        if (messages) {
            return NextResponse.json({
                success: true,
                messages
            });
        }
    }

    if (essense === "project") {
        const messages = await getMessages("project",essense_id);
        if (messages) {
            return NextResponse.json({
                success: true,
                messages
            });
        }
    }
    return NextResponse.json({
        success: false,
        error: "#mfnsmdfj"
    });
}
