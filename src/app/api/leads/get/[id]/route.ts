import getLeadFullData from "@/app/db/leads/getLeadFullData/getLeadFullData";
import { NextResponse } from "next/server";

export async function POST(request: Request, params: { params: { id: string } }) {
    const { id: lead_id } = params.params;

    const data = await getLeadFullData(Number(lead_id));

    return NextResponse.json({
        success: true,
        data: data
    });
   
}
