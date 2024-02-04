import getStockHistoryFromDB from "@/app/db/stock/getStockHistoryFromDB";
import { NextResponse } from "next/server";

export async function POST() {
  const stockHistory = await getStockHistoryFromDB();
  return NextResponse.json({
    success: true,
    stockHistory
  });
}
