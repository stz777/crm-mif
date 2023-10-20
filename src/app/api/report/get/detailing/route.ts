import { getUserByToken } from "@/app/components/getUserByToken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import getPayments from "./getPayments";
import getExpensesPerPurchaseTask from "./getExpensesPerPurchaseTask";

export async function POST(
    request: Request,
) {

    const auth = cookies().get('auth');
    if (!auth?.value) return new Response("Кто ты", { status: 401, });
    const user = await getUserByToken(auth?.value);
    if (!user) return new Response("Кто ты", { status: 401, });
    if (!user.is_boss) return new Response("Кто ты", { status: 401, });

    const { year, month } = await request.json();

    if (!(year && month)) {
        return NextResponse.json({
            success: true,
        });
    }

    const payments = await getPayments({
        year, month
    });

    const expensesPerPurchaseTask = await getExpensesPerPurchaseTask({
        year, month
    })
    return NextResponse.json({
        success: true,
        data: {
            payments,
            expensesPerPurchaseTask
        }
    });

}