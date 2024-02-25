import { NextResponse } from "next/server";
import { getUserByToken } from "@/app/components/getUserByToken";
import { cookies } from "next/headers";
import slugify from "slugify";
import fs from "fs";
import checkImageIsExists from "./checkImageIsExists";
import insertPayment from "./insertPayment";
import noticeEmployees from "./noticeEmployees";
import saveImageToDB from "./saveImageToDB";
import { saveMessage } from "./saveMessage";

export async function POST(
  request: Request,
  { params }: { params: { id: number } }
) {
  const auth = cookies().get("auth");
  if (!auth?.value) return new Response("Кто ты", { status: 401 });
  const user = await getUserByToken(auth?.value);
  if (!user) return new Response("Кто ты", { status: 401 });
  if (!user.is_manager) return new Response("Кто ты", { status: 401 });

  const formdata = await request.formData();
  const lead_id = formdata.get("lead_id");
  const sum = formdata.get("sum");

  const paymentId = await insertPayment(Number(lead_id), Number(sum), user.id);

  const messageId = await saveMessage(
    `Оплата по заказу: ${sum}₽`,
    "lead",
    Number(lead_id),
    user.id
  );
  const items: any = Array.from(formdata);

  for (let index = 0; index < items.length; index++) {
    const [name, value]: any = items[index];
    if (value instanceof File && name === "image") {
      let filename = slugify(
        value.name.toLocaleLowerCase().replace(/[^ a-zA-Zа-яА-Я0-9-.]/gim, "")
      );

      const imageIsExists = await checkImageIsExists(filename);
      if (imageIsExists) {
        const splittedFilename = filename.split(".");
        const newfilename =
          splittedFilename[0] + String(Date.now()) + "." + splittedFilename[1];
        filename = newfilename;
      }

      if (!messageId) break;

      noticeEmployees(
        "lead",
        Number(lead_id),
        user.username,
        `${process.env.SERVER}`
      );

      await saveImageToDB(Number(paymentId), filename);

      const buffer = await value.arrayBuffer();
      const filePath = `${String(process.env.IMAGES_FOLDER)}/${filename}`;
      try {
        fs.writeFileSync(filePath, Buffer.from(buffer));
      } catch (error: any) {
        console.error("Error writing to file:", error.message);
      }
    }
  }

  return NextResponse.json({
    success: true,
    paymentId,
  });
}