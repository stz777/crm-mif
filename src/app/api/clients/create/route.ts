import { NextResponse } from 'next/server'

export async function POST(req: any, res: any) {
    return NextResponse.json({
        success: true,
    });
}