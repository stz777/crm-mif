import { pool } from "@/app/db/connect";

export default async function saveImageToDB(
  expense_id: number,
  file_name: string
) {
  return pool
    .promise()
    .query(
      "INSERT INTO expenses_checks (expense_id, file_name) VALUES (?, ?)",
      [expense_id, file_name]
    )
    .then(([v]) => {

      console.log("vvv", v);
    });
}
