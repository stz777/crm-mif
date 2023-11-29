import { NextResponse } from "next/server";
// import slugify from "slugify";
// import checkImageIsExists from "../../clients/create/checkImageIsExists";
// import saveImageToDB from "../../clients/create/saveImageToDB";
// import saveMessage from "../../clients/create/saveMessage";
// import fs from "fs";

export async function POST(request: Request) {
    const data: any = await request.formData();
    const items: any = Array.from(data);

    const url = `${process.env.TASK_MANAGER_URL}/api/tasks/create`;
    const response = await fetch(url, {
        method: 'POST',
        body: data,
    })
        .then(response => {
            if (!response.ok) {
                const { status, statusText } = response;
                throw new Error(JSON.stringify({ status, statusText }, null, 2));
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            return error;
        });

    console.log('response', response);


    // const messageId = await saveMessage(items.find(([item]: any) => item).description, "lead", 1, 1);
    // for (let index = 0; index < items.length; index++) {
    //     const [name, value]: any = items[index]
    //     if (value instanceof File && name === "images") {
    //         let filename = slugify(value.name.toLocaleLowerCase().replace(/[^ a-zA-Zа-яА-Я0-9-.]/igm, ""));

    //         const imageIsExists = await checkImageIsExists(filename);
    //         if (imageIsExists) {
    //             const splittedFilename = filename.split(".");
    //             const newfilename = splittedFilename[0] + String(Date.now()) + "." + splittedFilename[1];
    //             filename = newfilename;
    //         }

    //         if (!messageId) break;

    //         await saveImageToDB(filename, messageId)

    //         const buffer = await value.arrayBuffer();
    //         const filePath = `${String(process.env.IMAGES_FOLDER)}/${filename}`;

    //         fs.writeFileSync(filePath, Buffer.from(buffer));
    //     }
    // }

    return NextResponse.json(response);
}