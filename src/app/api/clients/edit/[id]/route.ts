import { ClientInterface } from "@/app/clients/get/page";
import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";
import createClientMetaFn from "../../create/createClientMetaFn";

export async function POST(
    request: Request,
    { params }: { params: { id: number } }
) {
    const clientId = params.id;
    const data = await request.json();
    await updateClient(data, clientId);
    await clearClientMeta(clientId);

    try {
        const phones = data.phones;
        for (let index = 0; index < phones.length; index++) {
            const { phone } = phones[index];
            await createClientMetaFn({
                client: clientId,
                data_type: "phone",
                data: phone
            });
        }
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: "Что-то не так с телефонами"
        });
    }

    try {
        const emails = data.emails;
        for (let index = 0; index < emails.length; index++) {
            const { email } = emails[index];
            await createClientMetaFn({
                client: clientId,
                data_type: "email",
                data: email
            });
        }
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: "Что-то не так с почтой"
        });
    }

    try {
        const telegram = data.telegram;
        for (let index = 0; index < telegram.length; index++) {
            const { telegram: telegramNik } = telegram[index];
            await createClientMetaFn({
                client: clientId,
                data_type: "telegram",
                data: telegramNik
            });
        }
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: "Что-то не так с телеграмом"
        });
    }

    return NextResponse.json({
        success: true,
    });
}

async function updateClient(clientData: any, clientId: number) {
    await new Promise(r => {
        pool.query(`UPDATE clients SET full_name = "${clientData.fio}"`,
            function (err) {
                if (err) {
                    console.log('err #dm5n8ge', err);
                }
                r(true);
            })
    })
}

async function clearClientMeta(clientId: number) {
    const qs = `DELETE FROM clients_meta WHERE client = ${clientId}`;
    await new Promise(r => {
        pool.query(qs,
            function (err, res) {
                if (err) {
                    console.log('err #cmvfdo3jf;', err);
                }
                r(true);
            })
    })
}