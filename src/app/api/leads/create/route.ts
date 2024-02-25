import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";
import { cookies } from "next/headers";
import { getUserByToken } from "@/app/components/getUserByToken";
import getEployeeByID from "@/app/db/employees/getEployeeById";
import slugify from "slugify";
import checkImageIsExists from "../../clients/create/checkImageIsExists";
import insertPayment from "../../clients/create/insertPayment";
// import noticeEmployees from "../../clients/create/noticeEmployees";
// import saveMessage from "../../clients/create/saveMessage";
import createNewRole from "../update_employee_rights/createNewRole";
import fs from "fs";
import saveImageToDB from "../../payments/create/saveImageToDB";

export async function POST(
  request: Request,
  { params }: { params: { id: number } }
) {
  const auth = cookies().get("auth");
  if (!auth?.value) return new Response("Кто ты", { status: 401 });
  const user = await getUserByToken(auth?.value);
  if (!user) return new Response("Кто ты", { status: 401 });
  if (!user.is_manager) return new Response("Кто ты", { status: 401 });

  const data: any = await request.formData();

  const items: any = Array.from(data);

  let leadId = null;
  let newRoleId = null;

  const clientId = items.find((item: any) => item[0] === "client")[1];

  if (data.get("description") && data.get("deadline") && data.get("sum")) {
    leadId = await createLead({
      client: clientId,
      description: String(data.get("description")),
      title: "",
      deadline: String(data.get("deadline")),
      sum: String(data.get("sum")),
    });
    newRoleId = await createNewRole(user.id, leadId, "inspector");
  }

  if (leadId) {
    let paymentId = null;
    if (data.get("payment")) {
      paymentId = await insertPayment(
        leadId,
        Number(data.get("payment")),
        user.id
      );
    }

    // const messageId = await saveMessage(
    //   `Оплата по заказу: ${data.get("payment")}₽`,
    //   "lead",
    //   leadId,
    //   user.id
    // );

    for (let index = 0; index < items.length; index++) {
      const [name, value]: any = items[index];
      if (value instanceof File && name === "images") {
        let filename = slugify(
          value.name.toLocaleLowerCase().replace(/[^ a-zA-Zа-яА-Я0-9-.]/gim, "")
        );

        const imageIsExists = await checkImageIsExists(filename);
        if (imageIsExists) {
          const splittedFilename = filename.split(".");
          const newfilename =
            splittedFilename[0] +
            String(Date.now()) +
            "." +
            splittedFilename[1];
          filename = newfilename;
        }

        // if (!messageId) break;

        // noticeEmployees("lead", leadId, user.username, `${process.env.SERVER}`);

        await saveImageToDB(Number(paymentId), filename);

        const buffer = await value.arrayBuffer();
        const filePath = `${String(process.env.IMAGES_FOLDER)}/${filename}`;

        fs.writeFileSync(filePath, Buffer.from(buffer));
      }
    }
  }

  return NextResponse.json({
    success: true,
  });
}

export async function createLead(props: {
  client: number;
  description: string;
  title: string;
  deadline: string;
  sum: string;
}): Promise<number> {
  const { client, description, title, deadline, sum } = props;
  return await new Promise((resolve) => {
    pool.query(
      `INSERT INTO leads (client, description, title, deadline, sum, comment) VALUES (?,?,?,?,?,?)`,
      [client, description, title, deadline, sum, "недавно создан"],
      function (err, res: any) {
        if (err) {
          sendMessageToTg(
            JSON.stringify(
              {
                errorNo: "#fdsln4bd8d8d",
                error: err,
                values: { client, description, title, deadline },
              },
              null,
              2
            ),
            "5050441344"
          );
        }
        if (res.insertId) {
          (async () => {
            sendMessageToTg(`Создан заказ #${res.insertId}`, "5050441344");
            const boss = await getEployeeByID(1);
            sendMessageToTg(
              `Создан заказ #${res.insertId}`,
              String(boss.tg_chat_id)
            );
          })();
        }
        resolve(Number(res?.insertId));
      }
    );
  });
}
