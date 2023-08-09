import { NextResponse } from 'next/server'
import createClientFn from './createClientFn';
import createClientMetaFn from './createClientMetaFn';

export async function POST(req: any, res: any) {
    const data = await req.json();

    const newClientId: number = await createClientFn(data.fio);

    const phones = data.phones;
    const emails = data.emails;


    for (let index = 0; index < phones.length; index++) {
        const { phone } = phones[index];
        await createClientMetaFn({
            client: newClientId,
            data_type: "phone",
            data: phone
        })
    }

    for (let index = 0; index < emails.length; index++) {
        const { email } = emails[index];
        await createClientMetaFn({
            client: newClientId,
            data_type: "email",
            data: email
        })
    }

    return NextResponse.json({
        success: true,
        newClientId,
        data,
        phones
    });
}
