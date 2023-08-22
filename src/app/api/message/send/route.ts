import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";
import slugify from 'slugify'
import fs from "fs"
import { cookies } from 'next/headers'
import { getUserByToken } from "@/app/components/getUserByToken";


export async function POST(
    request: Request,
    { params }: { params: { id: number } }
) {

    const imagesFolder: string = String(process.env.IMAGES_FOLDER);

    const formData = await request.formData();

    const items: any = Array.from(formData);

    const text = items.find((item: any) => item[0] === "text")[1];
    const essense = items.find((item: any) => item[0] === "essense")[1];
    const essense_id = items.find((item: any) => item[0] === "essense_id")[1];

    const auth = cookies().get('auth');
    const user = await getUserByToken(String(auth?.value));


    if (!user) return NextResponse.json({
        success: false,
    });

    const messageId = await saveMessage(text, essense, essense_id, user.id);

    if (!messageId) {
        return NextResponse.json({
            success: false,
        });
    }

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

async function saveImageToDB(imageName: string, messageId: number) {
    // return {
    //     imageName,
    //     messageId
    // }
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