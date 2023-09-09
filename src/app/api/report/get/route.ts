import { getUserByToken } from "@/app/components/getUserByToken";
import getFinReportdata from "@/app/fin_report/getFinReportdata";
import { ReportSearchInterface } from "@/app/fin_report/page";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
) {

    const requestData: { searchParams: ReportSearchInterface } = await request.json();

    const auth = cookies().get('auth');
    if (!auth?.value) return new Response("Кто ты", { status: 401, });;
    const user = await getUserByToken(auth?.value);
    if (!user) return new Response("Кто ты", { status: 401, });;
    if (!user.is_boss) return new Response("Кто ты", { status: 401, });;

    const reportData = await getFinReportdata(requestData.searchParams);

    return NextResponse.json({
        success: true,
        reportData
    });

}