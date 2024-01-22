import { pool } from "@/app/db/connect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { category_id, category_name } = await request.json();
  const updated = await updateExpensesCategoryNameInDB(
    category_id,
    category_name
  );
  return NextResponse.json({
    success: updated,
  });
}

async function updateExpensesCategoryNameInDB(
  id: number,
  name: string
): Promise<boolean> {
  //   console.log("updateExpensesCategoryNameInDB", { id, name });
  return pool
    .promise()
    .query("UPDATE expenses_categories SET name = ? WHERE id = ?", [name, id])
    .then(([a]: any) => {
      return !!a.changedRows;
    })
    .catch((error) => {
      console.error("error #v0v66", error);
      return false;
    });
}
