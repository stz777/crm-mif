import { getLeads } from "@/app/leads/get/getLeadsFn";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { id: number } }
) {

    const leads = await getLeads();

    return NextResponse.json({
        success: true,
        leads
    });
}