import { getProjectsFn } from "@/app/projects/get/getProjectsFn";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
) {
    const { searchParams } = await request.json();
    const projects = await getProjectsFn(searchParams);
    return NextResponse.json({
        success: true,
        projects,
    });
}