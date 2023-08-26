import { getPurschaseTaskFn } from "@/app/purchasing_tasks/get/page";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
) {
    const { searchParams } = await request.json();
    const purchasingTasks = await getPurschaseTaskFn(searchParams);
    return NextResponse.json({
        success: true,
        purchasingTasks,
    });
}