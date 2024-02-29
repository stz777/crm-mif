import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";
import { getUserByToken } from "@/app/components/getUserByToken";
import { cookies } from "next/headers";

export async function POST(
  request: Request,
) {
  const auth = cookies().get("auth");
  if (!auth?.value) return new Response("Кто ты", { status: 401 });
  const user = await getUserByToken(auth?.value);
  if (!user) return new Response("Кто ты", { status: 401 });
  if (!user.is_boss) return new Response("Кто ты", { status: 401 });

  const data = await request.json();
  const { name, contacts, materials } = data;
  const createRes = await createSupplier(name, contacts, materials);

  return NextResponse.json({
    success: !!createRes,
  });
}

async function createSupplier(
  name: string,
  contacts: string,
  materials: string
): Promise<number | false> {
  return pool
    .promise()
    .query(
      `INSERT INTO suppliers ( name, contacts, materials  ) VALUES (?,?,?)`,
      [name, contacts, materials]
    )
    .then(([res]: any) => {
      return res.insertId;
    })
    .catch((error: any) => {
      console.error("err #j48", error);
      return false;
    });
}
