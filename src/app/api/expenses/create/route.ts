import { getUserByToken } from "@/app/components/getUserByToken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { pool } from "@/app/db/connect";
import slugify from "slugify";
import fs from "fs";
import saveImageToDB from "./saveImageToDB";
import createExpenseInDB from "./createExpenseInDB";
import checkImageIsExists from "./checkImageIsExists";

export async function POST(request: Request) {
  const auth = cookies().get("auth");
  if (!auth?.value) return new Response("Кто ты", { status: 401 });
  const user = await getUserByToken(auth?.value);
  if (!user) return new Response("Кто ты", { status: 401 });
  if (!user.is_manager) return new Response("Кто ты", { status: 401 });

  const data: any = await request.formData();

  const description = data.get("description");
  const category = data.get("category");
  const sum = data.get("sum");

  const expenseId = await createExpenseInDB(
    category,
    description,
    sum,
    user.id
  );

  if (!expenseId) {
    return NextResponse.json({
      success: false,
    });
  }

  const images = data.get("images");

  if (images) {
    let filename = slugify(
      images.name.toLocaleLowerCase().replace(/[^ a-zA-Zа-яА-Я0-9-.]/gim, "")
    );
    const imageIsExists = await checkImageIsExists(filename);
    if (imageIsExists) {
      const splittedFilename = filename.split(".");
      const newfilename =
        splittedFilename[0] + String(Date.now()) + "." + splittedFilename[1];
      filename = newfilename;
    }
    await saveImageToDB(expenseId, filename);
    const buffer = await images.arrayBuffer();
    const filePath = `${String(process.env.IMAGES_FOLDER)}/${filename}`;
    fs.writeFileSync(filePath, Buffer.from(buffer));
  }

  return NextResponse.json({
    success: true,
  });
}
