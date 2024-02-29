import getSuppliers from "@/app/db/suppliers/getSuppliers";
import { NextResponse } from "next/server";

export async function POST() {
  const suppliers = await getSuppliers();
  return NextResponse.json({
    success: true,
    suppliers,
  });
}
