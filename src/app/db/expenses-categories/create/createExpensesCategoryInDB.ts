import { pool } from "../../connect";

export default async function createExpensesCategoryInDB(
  name: string
): Promise<boolean> {
  return pool
    .promise()
    .query("INSERT INTO expenses_categories (name) VALUES (?)", [name])
    .then(([a]: any) => {
      return true;
    })
    .catch((error) => {
      return false;
      console.log("error", error);
    });
}
