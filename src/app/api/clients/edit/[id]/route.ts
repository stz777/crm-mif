import { ClientInterface } from "@/app/clients/get/page";
import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";
import createClientMetaFn from "../../create/createClientMetaFn";
import { sendMessageToTg } from "@/app/api/bugReport/route";

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
            function (err, res) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#dm5n8ge",
                                error: err,
                                values: {
                                    clientData,
                                    clientId
                                }
                            }, null, 2),
                        "5050441344"
                    )
                }
                if (res) {
                    sendMessageToTg(
                        [
                            `Изменили данные клиента #${clientId}`,
                            `новые данные `,
                            JSON.stringify(clientData, null, 2)
                        ].join("\n"),
                        "5050441344"
                    )
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
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#cmvfdo3jf",
                                error: err,
                                values: { clientId }
                            }, null, 2),
                        "5050441344"
                    )
                }
                r(true);
            })
    })
}