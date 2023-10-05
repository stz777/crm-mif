import { NextResponse } from 'next/server'
import createClientFn from './createClientFn';
import createClientMetaFn from './createClientMetaFn';
import { getUserByToken } from '@/app/components/getUserByToken';
import { cookies } from 'next/headers';
import { createLead } from '../../leads/create/route';
import createNewRole from '../../leads/update_employee_rights/createNewRole';
import slugify from 'slugify';
import fs from "fs";
import checkImageIsExists from './checkImageIsExists';
import insertPayment from './insertPayment';
import noticeEmployees from './noticeEmployees';
import saveImageToDB from './saveImageToDB';
import saveMessage from './saveMessage';

export async function POST(req: Request) {
    const auth = cookies().get('auth');
    if (!auth?.value) return new Response("Кто ты", { status: 401, });;
    const user = await getUserByToken(auth?.value);
    if (!user) return new Response("Кто ты", { status: 401, });;
    if (!user.is_manager) return new Response("Кто ты", { status: 401, });;

    const data = await req.formData();
    const items: any = Array.from(data);

    const newClientId: number = await createClientFn(String(data.get('fio')), String(data.get('address')));

    const phones = JSON.parse(String(data.get('phones')));

    console.log('phones', phones);


    const emails: any = JSON.parse(String(data.get('emails')));
    const telegram: any = JSON.parse(String(data.get('telegram')));

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


    let leadId = null;;
    let newRoleId = null;;

    if (data.get('description') && data.get('deadline') && data.get('sum')) {
        leadId = await createLead({
            client: newClientId,
            description: String(data.get('description')),
            title: "", deadline: String(data.get('deadline')), sum: String(data.get('sum'))
        })
        newRoleId = await createNewRole(user.id, leadId, "inspector");
    }

    if (leadId) {

        let paymentId = null;
        if (data.get("payment")) {
            paymentId = await insertPayment(leadId, Number(data.get("payment")), user.id);
        }

        const messageId = await saveMessage(`Оплата по заказу: ${data.get("payment")}₽`, "lead", leadId, user.id);


        for (let index = 0; index < items.length; index++) {
            const [name, value]: any = items[index]
            if (value instanceof File && name === "images") {
                let filename = slugify(value.name.toLocaleLowerCase().replace(/[^ a-zA-Zа-яА-Я0-9-.]/igm, ""));

                const imageIsExists = await checkImageIsExists(filename);
                if (imageIsExists) {
                    const splittedFilename = filename.split(".");
                    const newfilename = splittedFilename[0] + String(Date.now()) + "." + splittedFilename[1];
                    filename = newfilename;
                }

                if (!messageId) break;

                noticeEmployees(
                    "lead",
                    leadId,
                    user.username,
                    `${process.env.SERVER}`
                );

                await saveImageToDB(filename, messageId)

                const buffer = await value.arrayBuffer();
                const filePath = `${String(process.env.IMAGES_FOLDER)}/${filename}`;
                console.log('filePath', filePath);

                fs.writeFileSync(filePath, Buffer.from(buffer));
            }
        }
    }


    return NextResponse.json({
        success: true,
        newClientId,
        leadId,
        data,
        phones,
        newRoleId
    });
}