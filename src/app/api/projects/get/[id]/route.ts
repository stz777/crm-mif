import { getUserByToken } from "@/app/components/getUserByToken";
import { getProjectById } from "@/app/projects/single/[id]/getProjectById";
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

    const project = await getProjectById(params.id)
    return NextResponse.json({
        success: true,
        project
    });
}