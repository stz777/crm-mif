import { getClients } from "@/app/clients/get/getClients";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const searchParams = await await request.json();
    const clients = await getClients(searchParams);
    return NextResponse.json({
        success: true,
        clients
    })
}