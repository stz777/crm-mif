import { pool } from "@/app/db/connect";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";
import dbWorker from "@/app/db/dbWorker/dbWorker";

export default async function insertPayment(
  lead_id: number,
  sum: number,
  done_by: number
) {
  return new Promise((resolve) => {
    dbWorker(
      `INSERT INTO payments (lead_id, sum, done_by) VALUES (?,?,?)`,
      [lead_id, sum, done_by],
      function (err, res: any) {
        if (err) {
          sendMessageToTg(
            JSON.stringify(
              {
                errorNo: "#ck3n3oe",
                error: err,
                values: { lead_id, sum },
              },
              null,
              2
            )
          );
        }
        resolve(res?.insertId);
      }
    );
  });
}
