import { getUserByToken } from "@/app/components/getUserByToken";
import { getPurschaseTaskFn } from "@/app/purchasing_tasks/get/page";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
) {

    const auth = cookies().get('auth');
    if (!auth?.value) return new Response("Кто ты", { status: 401, });;
    const user = await getUserByToken(auth?.value);
    if (!user) return new Response("Кто ты", { status: 401, });;
    if (!user.is_manager) return new Response("Кто ты", { status: 401, });;


    const { searchParams } = await request.json();
    const purchasingTasks = await getPurschaseTaskFn(searchParams);
    return NextResponse.json({
        success: true,
        purchasingTasks,
    });
}