import { pool } from "@/app/db/connect";
import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import {
  ClientInterface,
  ClientMetaInterface,
  ClientsSearchInterface,
} from "@/app/components/types/clients";

export async function getClients(
  searchParams: ClientsSearchInterface
): Promise<ClientInterface[]> {
  const whereArray: string[] = [];
  const ids = [];
  
  if (searchParams?.keyword) {
    console.log("searchParams", searchParams.keyword);
    if (/[0-9]+/.test(searchParams.keyword)) {
      ids.push(searchParams.keyword);
      ids.push(...(await getClientsByPhoneInserts(searchParams.keyword)));
    } else {
      ids.push(...(await getClientsByNameInserts(searchParams.keyword)));
    }
  }

  if (ids.length) {
    whereArray.push(`id IN (${ids})`);
  }

  const whereString = whereArray.length
    ? "WHERE " + whereArray.join(" AND ")
    : "";

  const qs = `SELECT * FROM clients ${whereString} ORDER BY id DESC`;

  const clients: ClientInterface[] = await new Promise((r) => {
    pool.query(qs, function (err: any, res: ClientInterface[]) {
      if (err) {
        sendMessageToTg(
          JSON.stringify(
            {
              errorNo: "#mdsasd34nd",
              error: err,
              values: {},
            },
            null,
            2
          ),
          "5050441344"
        );
      }
      r(res);
    });
  });

  for (let index = 0; index < clients.length; index++) {
    const client = clients[index];
    clients[index].meta = await getClientMeta(client.id);
  }

  return clients;
}

async function getClientMeta(clientId: number): Promise<ClientMetaInterface[]> {
  return await new Promise((r) => {
    pool.query(
      `SELECT * FROM clients_meta WHERE client = ${clientId}`,
      function (err: any, res: any) {
        if (err) {
          sendMessageToTg(
            JSON.stringify(
              {
                errorNo: "#msk3ng0c",
                error: err,
                values: { clientId },
              },
              null,
              2
            ),
            "5050441344"
          );
        }
        r(res);
      }
    );
  });
}

async function getClientsByPhoneInserts(phone: string): Promise<number[]> {
  return pool
    .promise()
    .query(
      `SELECT client FROM clients_meta WHERE data_type = 'phone' AND data LIKE ? `,
      [`%${phone}%`]
    )
    .then(([x]: any) => {
      return x.map((metaItem: any) => metaItem.client);
    })
    .catch((error: any) => {
      console.log("error £f9f6", error);
    });
}

async function getClientsByNameInserts(keyword: string): Promise<number[]> {
  return pool
    .promise()
    .query(`SELECT * FROM clients WHERE full_name LIKE ? `, [`%${keyword}%`])
    .then(([x]: any) => {
      return x.map((client: any) => client.id);
    })
    .catch((error: any) => {
      console.log("error £f9f6", error);
    });
}
