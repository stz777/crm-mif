import { getClients } from "@/app/clients/get/getClients";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const data = await request.json();
    if (!data.phone) {
        return NextResponse.json({
            success: false,
            error: "#vjf9n"
        })
    }

    const clients = await getClients({ phone: data.phone });

    return NextResponse.json({
        success: true,
        clients
    })
}