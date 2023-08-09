import { NextResponse } from 'next/server'

export async function POST(req: any, res: any) {
    const data = await req.json();

    return NextResponse.json({
        success: true,
        data,
    });
}