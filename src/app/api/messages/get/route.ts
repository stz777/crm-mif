// import { getLeads } from "@/app/leads/get/page";
import getMessages from "@/app/db/messages/getMessages";
import getMessagesByLeadId from "@/app/leads/single/[id]/getMessagesByLeadId";
import getMessagesByTaskId from "@/app/purchasing_tasks/single/[task_id]/getMessagesByTaskId";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    // { params }: { params: { id: number } }
) {

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
