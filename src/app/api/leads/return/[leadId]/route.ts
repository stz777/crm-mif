import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { getUserByToken } from "@/app/components/getUserByToken";
import { pool } from "@/app/db/connect";
import dayjs from "dayjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { leadId: number } }
) {
  const auth = cookies().get("auth");
  if (!auth?.value) return new Response("Кто ты", { status: 401 });
  const user = await getUserByToken(auth?.value);
  if (!user) return new Response("Кто ты", { status: 401 });
  if (!user.is_boss) return new Response("Кто ты", { status: 401 });

  const { leadId } = params;

  const res = await returnLeadFunction(leadId);
  if (res) {
    return NextResponse.json({
      success: true,
    });
  } else {
    return NextResponse.json({
      success: false,
    });
  }
}

async function returnLeadFunction(leadId: number) {
  //   const now = dayjs().format("YYYY-MM-DD HH:mm:ss");

  return await new Promise((resolve) => {
    pool.query(
      `UPDATE leads SET done_at = null WHERE id = ?`,
      [leadId],
      function (err, res: any) {
        if (err) {
          sendMessageToTg(
            JSON.stringify(
              {
                errorNo: "#vf84n",
                error: err,
                values: { leadId },
              },
              null,
              2
            ),
            "5050441344"
          );
        }
        if (res.changedRows) {
          sendMessageToTg(`Заказ #${leadId} восстановлен`, "5050441344");
        }
        resolve(res?.changedRows);
      }
    );
  });
}
