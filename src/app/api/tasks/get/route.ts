import getTasksFromDB from "@/app/db/tasks/getTasksFromDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const searchParams = await request.json();
const tasks = await getTasksFromDB(searchParams);
  return NextResponse.json({
    success: true,
    tasks,
  });
}
