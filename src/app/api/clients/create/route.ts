import { NextResponse } from 'next/server'
import createClientFn from './createClientFn';
import createClientMetaFn from './createClientMetaFn';
import { getUserByToken } from '@/app/components/getUserByToken';
import { cookies } from 'next/headers';
import { createLead } from '../../leads/create/route';

export async function POST(req: any, res: any) {
    const auth = cookies().get('auth');
    if (!auth?.value) return new Response("Кто ты", { status: 401, });;
    const user = await getUserByToken(auth?.value);
    if (!user) return new Response("Кто ты", { status: 401, });;
    if (!user.is_manager) return new Response("Кто ты", { status: 401, });;

    const data = await req.json();

    const newClientId: number = await createClientFn(data.fio, data.address);

    const phones = data.phones;
    const emails = data.emails;
    const telegram = data.telegram;


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

    for (let index = 0; index < telegram.length; index++) {
        const { telegram: tgUsername } = telegram[index];
        await createClientMetaFn({
            client: newClientId,
            data_type: "telegram",
            data: tgUsername
        })
    }

    const leadId = await createLead({
        client: newClientId,
        description: data.description,
        title: "", deadline: data.deadline, sum: data.sum
    })

    return NextResponse.json({
        success: true,
        newClientId,
        leadId,
        data,
        phones
    });
}
