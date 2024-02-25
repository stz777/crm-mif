import { getUserByToken } from "@/app/components/getUserByToken";
import insertEntryToHistoryDB from "@/app/db/stock/insertEntryToHistoryDB";
import insertMaterialToStockDB from "@/app/db/stock/insertMaterialToStockDB";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const auth = cookies().get("auth");
  if (!auth?.value) return new Response("Кто ты", { status: 401 });
  const user = await getUserByToken(auth?.value);
  if (!user) return new Response("Кто ты", { status: 401 });
  if (!user.is_boss) return new Response("Кто ты", { status: 401 });

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
    user.id,
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
