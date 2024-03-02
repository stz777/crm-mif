import { SupplierInterface } from "@/app/components/types/supplierInterface";
import { pool } from "@/app/db/connect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data: SupplierInterface = await request.json();
  const result = await updateSupplierInDB(data);
  return NextResponse.json({
    success: null,
    data,
    result,
  });
}

async function updateSupplierInDB(
  supplier: SupplierInterface
): Promise<boolean> {
  return pool
    .promise()
    .query(
      "update suppliers set name=?, contacts=?, materials=? where id = ?",
      [supplier.name, supplier.contacts, supplier.materials, supplier.id]
    )
    .then(([res]: any) => {
      return res.affectedRows;
    })
    .catch((error) => {
      console.error("err #fjf84", error);
      return null;
    });
}
