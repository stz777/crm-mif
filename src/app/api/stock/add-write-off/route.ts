import { pool } from "@/app/db/connect";
import getStockFromDB from "@/app/db/stock/getStockFromDB";
import insertEntryToHistoryDB from "@/app/db/stock/insertEntryToHistoryDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
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
