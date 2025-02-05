import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { ClientMetaInterface } from "@/app/components/types/clients";
import { pool } from "@/app/db/connect";
import dbWorker from "../dbWorker/dbWorker";

export default async function getClentMeta(
  client_id: number
): Promise<ClientMetaInterface[]> {
  return new Promise((resolve) => {
    dbWorker(
      "SELECT * FROM clients_meta WHERE client = ? ORDER BY id DESC",
      [client_id],
      function (err, result: any[]) {
        if (err) {
          sendMessageToTg(
            JSON.stringify(
              {
                errorNo: "#kdj[kkIykn4m",
                error: err,
                values: { client_id },
              },
              null,
              2
            ),
            "5050441344"
          );
          resolve([]);
        }
        if (!result.length) {
          resolve([]);
        } else {
          resolve(result);
        }
      }
    );
  });
}
