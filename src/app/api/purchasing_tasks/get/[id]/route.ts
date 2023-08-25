import { getPurchaseTaskData } from "@/app/purchasing_tasks/single/[task_id]/page";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { id: number } }
) {
    const purchaseTaskData = await getPurchaseTaskData(params.id)
    return NextResponse.json({
        success: true,
        purchaseTaskData
    });
}