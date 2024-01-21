import { pool } from "@/app/db/connect";

export default async function createExpenseInDB(
    category_id: number,
    description: string,
    sum: number,
    done_by: number
  ): Promise<number> {
    return pool
      .promise()
      .query(
        "INSERT INTO expenses (done_by, sum,description,category_id) VALUES (?,?,?,?)",
        [done_by, sum, description, category_id]
      )
      .then(([x]: any) => {
        return x.insertId;
      })
      .catch((error) => {
        console.error("error #d0d84", error);
        return 0;
      });
  }