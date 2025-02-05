import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";
import slugify from 'slugify'
import fs from "fs"
import { cookies } from 'next/headers'
import { getUserByToken } from "@/app/components/getUserByToken";
import getEmployeesByProjectId from "@/app/db/employees/getEmployeesByProjectId";
import getEmployeesByPurchaseTask from "@/app/db/employees/getEmployeesByPurchaseTask";
import getEmployeesByLeadId from "@/app/db/leads/getLeadFullData/getEmployeesByLeadId";
import dbWorker from "@/app/db/dbWorker/dbWorker";

export async function POST(
    request: Request,
    { params }: { params: { id: number } }
) {
    const auth = cookies().get('auth');
    if (!auth?.value) return new Response("Кто ты", { status: 401, });;
    const user = await getUserByToken(auth?.value);
    if (!user) return new Response("Кто ты", { status: 401, });;

    const imagesFolder: string = String(process.env.IMAGES_FOLDER);

    const formData = await request.formData();

    const items: any = Array.from(formData);

    const text = items.find((item: any) => item[0] === "text")[1];
    const essense = items.find((item: any) => item[0] === "essense")[1];
    const essense_id = items.find((item: any) => item[0] === "essense_id")[1];

    if (!user) return NextResponse.json({
        success: false,
    });

    const messageId = await saveMessage(text, essense, essense_id, user.id);

    if (!messageId) {
        return NextResponse.json({
            success: false,
        });
    }

    noticeEmployees(
        essense,
        essense_id,
        user.username,
        `${process.env.SERVER}`
    );

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

            await saveImageToDB(filename, messageId)

            const buffer = await value.arrayBuffer();
            const filePath = `${imagesFolder}/${filename}`;
            console.log('filePath', filePath);

            fs.writeFileSync(filePath, Buffer.from(buffer));

        }
    }

    return NextResponse.json({
        success: true,
        messageId,
    });
}

async function saveMessage(text: string, essense: string, essense_id: number, sender: number): Promise<number | false> {
    return new Promise((resolve) => {
        dbWorker(
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


async function checkImageIsExists(imageName: string) {
    return new Promise((resolve) => {
        dbWorker(
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

async function saveImageToDB(imageName: string, messageId: number) {
    // return {
    //     imageName,
    //     messageId
    // }
    return new Promise((resolve) => {
        dbWorker(
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
    if (essense === "project") {
        employees = await getEmployeesByProjectId(essense_id);
    }
    if (essense === "purchase_task") {
        employees = await getEmployeesByPurchaseTask(essense_id);
    }

    if (!employees) {
        await sendMessageToTg(
            `Ошибка #err_dksj877`,
            "5050441344"
        );
    }

    if (employees) {
        for (let index = 0; index < employees.length; index++) {
            const { tg_chat_id } = employees[index];
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
