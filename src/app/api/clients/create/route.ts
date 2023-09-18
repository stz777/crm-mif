import { NextResponse } from 'next/server'
import createClientFn from './createClientFn';
import createClientMetaFn from './createClientMetaFn';
import { getUserByToken } from '@/app/components/getUserByToken';
import { cookies } from 'next/headers';
import { createLead } from '../../leads/create/route';
import createNewRole from '../../leads/update_employee_rights/createNewRole';
import { pool } from '@/app/db/connect';
import { sendMessageToTg } from '../../bugReport/sendMessageToTg';
import slugify from 'slugify';
import fs from "fs";
import getEmployeesByLeadId from '@/app/leads/single/[id]/getEmployeesByLeadId';

export async function POST(req: Request, res: any) {
    const auth = cookies().get('auth');
    if (!auth?.value) return new Response("Кто ты", { status: 401, });;
    const user = await getUserByToken(auth?.value);
    if (!user) return new Response("Кто ты", { status: 401, });;
    if (!user.is_manager) return new Response("Кто ты", { status: 401, });;

    const data = await req.formData();
    const items: any = Array.from(data);

    const newClientId: number = await createClientFn(String(data.get('fio')), String(data.get('address')));

    const phones = JSON.parse(String(data.get('phones')));

    const emails: any = JSON.parse(String(data.get('emails')));;
    const telegram: any = JSON.parse(String(data.get('telegram')));;

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

        const messageId = await saveMessage(`Оплата по заказу: ${data.get("payment")}`, "lead", leadId, user.id);


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


async function insertPayment(lead_id: number, sum: number, done_by: number) {
    return new Promise(resolve => {
        pool.query(
            `INSERT INTO payments (lead_id, sum, done_by) VALUES (?,?,?)`,
            [lead_id, sum, done_by],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#ck3n3oe",
                                error: err,
                                values: { lead_id, sum }
                            }, null, 2),
                    )
                }
                resolve(res?.insertId)
            }
        );
    })
}


async function checkImageIsExists(imageName: string) {
    return new Promise((resolve) => {
        pool.query(
            "SELECT * FROM media WHERE name = ?",
            [imageName],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#ndn3kvfd9",
                                error: err,
                                values: { imageName }
                            }, null, 2),
                        "5050441344"
                    )
                    resolve(null)
                }
                if (res) {
                    resolve(res.length > 0)
                }
            }
        )
    })
}


async function saveMessage(text: string, essense: string, essense_id: number, sender: number): Promise<number | false> {
    return new Promise((resolve) => {
        pool.query(
            "INSERT INTO messages (text,essense,essense_id,sender) VALUES (?,?,?,?)",
            [text, essense, essense_id, sender],
            function (err, result: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#mckdj3",
                                error: err,
                                values: { text, essense, essense_id }
                            }, null, 2),
                        "5050441344"
                    )
                    resolve(false)
                }
                if (result) {
                    resolve(result.insertId)
                }
            }
        )
    })
}



async function saveImageToDB(imageName: string, messageId: number) {
    return new Promise((resolve) => {
        pool.query(
            "INSERT INTO media (message, is_image, name) VALUES(?,?,?)",
            [messageId, 1, imageName],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#md8ch3nmkx9",
                                error: err,
                                values: {
                                    imageName,
                                    messageId
                                }
                            }, null, 2),
                        "5050441344"
                    )
                    resolve(null)
                }
                if (res.insertId) {
                    resolve(res.insertId)
                } else {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#dn2nnfls",
                                error: "Хуйня какая-то произошла",
                                values: {
                                    imageName,
                                    messageId
                                }
                            }, null, 2),
                        "5050441344"
                    )
                }
            }
        )
    })
}



async function noticeEmployees(essense: string, essense_id: number, username: string, domain: string) {
    let employees;
    if (essense === "lead") {
        employees = await getEmployeesByLeadId(essense_id);
    }
   
    if (!employees) {
        await sendMessageToTg(
            `Ошибка #err_dksj877`,
            "5050441344"
        );
    }

    if (employees) {
        for (let index = 0; index < employees.length; index++) {
            const { user_id, tg_chat_id } = employees[index];
            if (tg_chat_id) {
                await sendMessageToTg(
                    `Пришло сообщение в ${translator[essense].name} #${essense_id} от ${username}`,
                    String(tg_chat_id)
                );
                await sendMessageToTg(
                    `${domain}${translator[essense].path}${essense_id}`,
                    String(tg_chat_id)
                );
            }
        }
    }
}


const translator: any = {
    lead: {
        name: "заказ",
        path: "/leads/single/"
    },
    purchase_task: {
        name: "задачу-закупку",
        path: "/purchasing_tasks/single/"
    },
    project: {
        name: "проект",
        path: "/projects/single/"
    },
}