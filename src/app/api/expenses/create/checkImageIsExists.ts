import { pool } from "@/app/db/connect";

export default async function checkImageIsExists(imageName: string) {
  return pool
    .promise()
    .query("SELECT * FROM expenses_checks WHERE file_name = ?", [imageName])
    .then(([images]: any) => !!images.length)
    .catch((error: any) => {
      console.error("error #f9f8d", error);
      return 0;
    });
}
