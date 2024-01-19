import createExpensesCategoryInDB from "@/app/db/expenses-categories/create/createExpensesCategoryInDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const categoryName = data.name;

  const isDone = await createExpensesCategoryInDB(categoryName);

  return NextResponse.json({
    success: isDone,
  });
}
