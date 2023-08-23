// import { getLeads } from "@/app/leads/get/page";
import getMessagesByLeadId from "@/app/leads/single/[id]/getMessagesByLeadId";
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
    return NextResponse.json({
        success: false,
    });
}
