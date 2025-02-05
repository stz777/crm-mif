import { pool } from "@/app/db/connect";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";
import dbWorker from "@/app/db/dbWorker/dbWorker";

export default async function saveImageToDB(payment_id: number, file_name: string) {
  return new Promise((resolve) => {
    dbWorker(
      "INSERT INTO payment_checks (payment_id, file_name) VALUES(?,?)",
      [payment_id, file_name],
      function (err, res: any) {
        if (err) {
          sendMessageToTg(
            JSON.stringify(
              {
                errorNo: "#md8ch3nmkx9",
                error: err,
                values: {
                  payment_id,
                  file_name,
                },
              },
              null,
              2
            )
          );
          resolve(null);
        }
        if (res.insertId) {
          resolve(res.insertId);
        } else {
          sendMessageToTg(
            JSON.stringify(
              {
                errorNo: "#dn2nnfls",
                error: "Хуйня какая-то произошла",
                values: {
                  payment_id,
                  file_name,
                },
              },
              null,
              2
            )
          );
        }
      }
    );
  });
}