import getStockFromDB from "@/app/db/stock/getStockFromDB";
import { NextResponse } from "next/server";

export async function POST() {
  const stock = await getStockFromDB();
  return NextResponse.json({
    success: true,
    stock,
  });
}