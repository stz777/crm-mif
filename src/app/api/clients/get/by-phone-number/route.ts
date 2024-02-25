import {
  ClientInterface,
  ClientMetaInterface,
} from "@/app/components/types/clients";
import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();
  if (!data.phone) {
    return NextResponse.json({
      success: false,
      error: "#vjf9n",
    });
  }

  const clients = await getClients(data);

  return NextResponse.json({
    success: true,
    clients,
  });
}

async function getClients(searchParams: any): Promise<ClientInterface[]> {

  const clients: ClientInterface[] = await pool
    .promise()
    .query(
      `SELECT * FROM clients WHERE id IN (
            SELECT client FROM clients_meta WHERE data_type = 'phone' AND data LIKE ?
          ) ORDER BY id DESC`,
      [`%${searchParams.phone}%`]
    )
    .then(([clients]: any) => {
      return clients;
    })
    .catch((error) => {
      console.error("err #fkf94j", error);
      return [];
    });

  for (let index = 0; index < clients.length; index++) {
    const client = clients[index];
    clients[index].meta = await getClientMeta(client.id);
  }

  return clients;
}

async function getClientMeta(clientId: number): Promise<ClientMetaInterface[]> {
  return pool
    .promise()
    .query("SELECT * FROM clients_meta WHERE client = ?", [clientId])
    .then(([meta]: any) => {
      return meta;
    })
    .catch((error) => {
      console.error("error #fjf844j", error);
      return [];
    });
}
