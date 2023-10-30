import { getUserByToken } from "@/app/components/getUserByToken";
import { getEmployeesByPurchaseTaskId } from "@/app/db/employees/getEmployeesByPurchaseTaskId/getEmployeesByPurchaseTaskId";
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
    if (!user.is_boss) return new Response("Кто ты", { status: 401, });;
    const { id } = params;

    const data = await getEmployeesByPurchaseTaskId(id);

    return NextResponse.json({
        success: true,
        id,
        data
    });
}
