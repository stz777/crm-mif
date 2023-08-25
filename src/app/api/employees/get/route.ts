import { getEmployees } from "@/app/employees/get/getEmployeesFn";
import { NextResponse } from "next/server";

export async function GET(
    // request: Request,
    // { params }: { params: { leadId: number } }
) {

    const employees = await getEmployees();

    return NextResponse.json({
        success: true,
        employees,
    });
}