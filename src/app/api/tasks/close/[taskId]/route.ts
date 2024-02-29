import { pool } from "@/app/db/connect";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  params: { params: { taskId: string } }
) {
  const done = await closeTaskInDB(Number(params.params.taskId));
  return NextResponse.json({ success: done });
}

async function closeTaskInDB(taskId: number): Promise<boolean> {
  const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
  return pool
    .promise()
    .query("update tasks set done_at = ? where id = ?", [now, taskId])
    .then(([x]: any) => {
      return !!x.affectedRows;
    })
    .catch((error) => {
      console.error("#mfd84", error);
      return false;
    });
}
