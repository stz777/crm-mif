import { NextResponse } from 'next/server'
import createClientFn from './createClientFn';

export async function POST(req: any, res: any) {
    const data = await req.json();

    const newClientId = await createClientFn(data.fio);

    return NextResponse.json({
        success: true,
        newClientId,
        data,
    });
}
