import { pool } from "@/app/db/connect";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  params: { params: { taskId: string } }
) {
  const done = await closeTaskInDB(Number(params.params.taskId));
  return NextResponse.json({ success: null });
}

async function closeTaskInDB(taskId: number) {
  const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
  return pool
    .promise()
    .query("update tasks set done_at = ? where id = ?", [now, taskId])
    .then(([x]) => {
      console.log("xxx", x);
      return x;
    })
    .catch((error) => {
      console.error("#mfd84", error);
    });
}
