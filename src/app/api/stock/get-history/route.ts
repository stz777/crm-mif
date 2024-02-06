import getStockHistoryFromDB from "@/app/stock/history/getStockHistoryFromDB";
import { SearchParamsInterface } from "@/app/stock/history/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const searchparams: SearchParamsInterface = await request.json();
  const stockHistory = await getStockHistoryFromDB(searchparams);
  return NextResponse.json({
    success: true,
    stockHistory,
    searchparams
  });
}
