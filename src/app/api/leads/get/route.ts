import { getLeads } from "@/app/leads/get/getLeadsFn";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
) {

    const searchParams = await await request.json();
    const leads = await getLeads(searchParams);

    return NextResponse.json({
        success: true,
        leads
    });
}