import insertMaterialToStockDB from "@/app/db/stock/insertMaterialToStockDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const materialId = await insertMaterialToStockDB(data.material, data.count);
  if (!materialId) {
    return NextResponse.json({
      success: false,
    });
  }
}
