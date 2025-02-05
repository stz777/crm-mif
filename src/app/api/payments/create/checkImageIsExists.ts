import { pool } from "@/app/db/connect";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";
import dbWorker from "@/app/db/dbWorker/dbWorker";

export default async function checkImageIsExists(imageName: string) {
  return new Promise((resolve) => {
    dbWorker(
      "SELECT * FROM media WHERE name = ?",
      [imageName],
      function (err, res: any) {
        if (err) {
          sendMessageToTg(
            JSON.stringify(
              {
                errorNo: "#ndn3kvfd9",
                error: err,
                values: { imageName },
              },
              null,
              2
            )
          );
          resolve(null);
        }
        if (res) {
          resolve(res.length > 0);
        }
      }
    );
  });
}
