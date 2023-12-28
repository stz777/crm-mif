import { pool } from "@/app/db/connect";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";

export default async function saveImageToDB(lead_id: number, file_name: string) {
    return new Promise((resolve) => {
      pool.query(
        "INSERT INTO payment_checks (lead_id, file_name) VALUES(?,?)",
        [lead_id, file_name],
        function (err, res: any) {
          if (err) {
            sendMessageToTg(
              JSON.stringify(
                {
                  errorNo: "#md8ch3nmkx9",
                  error: err,
                  values: {
                    lead_id,
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
                    lead_id,
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