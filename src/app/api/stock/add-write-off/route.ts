import { getUserByToken } from "@/app/components/getUserByToken";
import { pool } from "@/app/db/connect";
import getStockFromDB from "@/app/db/stock/getStockFromDB";
import insertEntryToHistoryDB from "@/app/db/stock/insertEntryToHistoryDB";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const auth = cookies().get("auth");
  if (!auth?.value) return new Response("Кто ты", { status: 401 });
  const user = await getUserByToken(auth?.value);
  if (!user) return new Response("Кто ты", { status: 401 });
  if (!user.is_boss) return new Response("Кто ты", { status: 401 });

  const { materialId, count, comment } = await request.json();
  const allStock = await getStockFromDB();
  const countOfCurrentMaterial = allStock.find(
    (material) => material.id === materialId
  )?.count;

  if (!countOfCurrentMaterial)
    return NextResponse.json({
      success: false,
      error: "Что-то пошло не так #ff99",
    });

  const newStockCount = countOfCurrentMaterial - count;

  if (newStockCount < 0) {
    return NextResponse.json({
      success: false,
      error: "Нельзя списывать больше, чем есть на складе",
    });
  }

  const stockIsUpdated = await updateStockCountInDB(materialId, count);

  if (!stockIsUpdated)
    return NextResponse.json({
      success: false,
      error: "#fkf99",
    });

  const updateHistoryResult = await insertEntryToHistoryDB(
    materialId,
    count,
    user.id,
    0,
    comment
  );

  if (!updateHistoryResult)
    return NextResponse.json({
      success: false,
      error: "#jf75",
    });

  return NextResponse.json({
    success: true,
  });
}

async function updateStockCountInDB(
  materialId: number,
  count: number
): Promise<boolean> {
  return pool
    .promise()
    .query("UPDATE stock SET count = count - ? WHERE id = ?", [
      count,
      materialId,
    ])
    .then(([res]: any) => {
      return !!res.changedRows;
    })
    .catch((error: any) => {
      console.error("error", error);
      return false;
    });
}
