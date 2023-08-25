import { getEmployees } from "@/app/employees/get/getEmployeesFn";
import { NextResponse } from "next/server";

export async function POST(
    request: any,
) {
    const data = await request.json();
    const employees = await getEmployees(data.searchParams);
    return NextResponse.json({
        success: true,
        employees,
    });
}