import { getUserByToken } from "@/app/components/getUserByToken";
import { pool } from "@/app/db/connect";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  a: NextRequest,
  params: { params: { employeeId: any } }
) {
  const { employeeId } = params.params;
  const auth = cookies().get("auth");
  if (!auth?.value) return new Response("Кто ты", { status: 401 });
  const user = await getUserByToken(auth?.value);
  if (!user) return new Response("Кто ты", { status: 401 });
  if (!user.is_manager) return new Response("Кто ты", { status: 401 });
  const leads = await getLeadsFromDBByEmployeeId(employeeId);
  return NextResponse.json({
    success: true,
    leads,
  });
}

async function getLeadsFromDBByEmployeeId(employeeId: number) {
  return pool
    .promise()
    .query(
      `select
        *
        ,(
        SELECT 
          CAST(sum(sum) as SIGNED) 
        FROM payments 
        WHERE 
          lead_id = leads.id) 
        as payments
      from leads
      where 
        id in (select lead_id from leads_roles where user = ?)`,
      [employeeId]
    )
    .then(([x]) => x);
}

export interface LeadsByEmployeeInterface {
  id: number;
  description: string;
  create_date: string;
  sum: number;
  payments: number;
}
