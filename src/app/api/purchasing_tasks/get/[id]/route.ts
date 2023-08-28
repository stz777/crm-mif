import { getUserByToken } from "@/app/components/getUserByToken";
import { getPurchaseTaskData } from "@/app/purchasing_tasks/single/[task_id]/page";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: { id: number } }
) {
    
    const auth = cookies().get('auth');
    if (!auth?.value) return new Response("Кто ты", { status: 401, });;
    const user = await getUserByToken(auth?.value);
    if (!user) return new Response("Кто ты", { status: 401, });;
    if (!user.is_manager) return new Response("Кто ты", { status: 401, });;

    
    const purchaseTaskData = await getPurchaseTaskData(params.id)
    return NextResponse.json({
        success: true,
        purchaseTaskData
    });
}