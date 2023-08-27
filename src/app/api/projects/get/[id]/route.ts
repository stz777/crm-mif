import { getProjectById } from "@/app/projects/single/[id]/getProjectById";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: { id: number } }
) {
    const project = await getProjectById(params.id)
    return NextResponse.json({
        success: true,
        project
    });
}