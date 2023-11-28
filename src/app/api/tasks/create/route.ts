import { NextResponse } from "next/server";
import slugify from "slugify";
import checkImageIsExists from "../../clients/create/checkImageIsExists";
import saveImageToDB from "../../clients/create/saveImageToDB";
import saveMessage from "../../clients/create/saveMessage";
import fs from "fs";

export async function POST(request: Request) {
    const data: any = await request.formData();
    const items: any = Array.from(data);

    const url = `${process.env.TASK_MANAGER_URL}/api/tasks/create`;

    fetch(url, {
        method: 'POST',
        body: data,
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Request failed');
            }
            return response.json();
        })
        .then(data => {
            console.log('dadadada', data);
        })
        .catch(error => {
            // Обработка ошибок
            console.error('err #n38cj', error);
        });
   
    const messageId = await saveMessage(items.find(([item]: any) => item).description, "lead", 1, 1);
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

            await saveImageToDB(filename, messageId)

            const buffer = await value.arrayBuffer();
            const filePath = `${String(process.env.IMAGES_FOLDER)}/${filename}`;

            fs.writeFileSync(filePath, Buffer.from(buffer));
        }
    }

    return NextResponse.json({
        success: true,
        items
    });
}