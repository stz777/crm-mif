import insertEntryToHistoryDB from "@/app/db/stock/insertEntryToHistoryDB";
import insertMaterialToStockDB from "@/app/db/stock/insertMaterialToStockDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { count, material } = await request.json();
  const materialId = await insertMaterialToStockDB(material, count);
  if (!materialId) {
    return NextResponse.json({
      success: false,
    });
  }
  const historyIsUpdated = await insertEntryToHistoryDB(
    materialId,
    count,
    1,
    "Новый материал"
  );

  if (historyIsUpdated) {
    return NextResponse.json({
      success: true,
    });
  }
  return NextResponse.json({
    success: false,
  });
}
