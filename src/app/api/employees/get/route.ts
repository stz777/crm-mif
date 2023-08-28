import { getUserByToken } from "@/app/components/getUserByToken";
import { getEmployees } from "@/app/employees/get/getEmployeesFn";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
    request: any,
) {
    const auth = cookies().get('auth');
    if (!auth?.value) return new Response("Кто ты", { status: 401, });;
    const user = await getUserByToken(auth?.value);
    if (!user) return new Response("Кто ты", { status: 401, });;
    if (!user.is_manager) return new Response("Кто ты", { status: 401, });;

    const data = await request.json();
    const employees = await getEmployees(data.searchParams);
    return NextResponse.json({
        success: true,
        employees,
    });
}