import getExpenseCategories from "@/app/db/expenses-categories/get/getExpenseCategories";
import getExpenses from "@/app/db/expenses/get/getExpensesFromDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const searchParams = await request.json();

  const expensesCategories = await getExpenseCategories();
  const expenses = await getExpenses(searchParams);

  return NextResponse.json({
    success: true,
    expensesCategories,
    expenses,
  });
}
