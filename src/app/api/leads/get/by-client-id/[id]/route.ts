import { LeadInterface } from "@/app/components/types/lead";
import { pool } from "@/app/db/connect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(_: any, b: { params: { id: any } }) {
  const leads = await getLeadsByClientName(b.params.id);
  return NextResponse.json({
    success: null,
    leads,
  });
}

async function getLeadsByClientName(
  client_id: number
): Promise<LeadInterface[]> {

  return pool
    .promise()
    .query(
      `SELECT * FROM leads WHERE client IN (
          SELECT id FROM clients WHERE id = ? 
        )`,
      [client_id]
    )
    .then(([leads]: any) => {
      return leads;
    })
    .catch((error: any) => {
      console.log("error #f9333f6", error);
      return [];
    });
}
