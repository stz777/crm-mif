import { pool } from "../connect";

export default async function insertEntryToHistoryDB(
  materialId: number,
  count: number,
  is_adjunction: number,
  comment: string
): Promise<number> {
  return pool
    .promise()
    .query(
      "INSERT INTO stock_history (material, count, is_adjunction, comment) VALUES (?,?,?,?)",
      [materialId, count, is_adjunction, comment]
    )
    .then(([res]: any) => {
      return res.insertId;
    })
    .catch((error: any) => {
      console.error("error #f94h5vd", error);
      return 0;
    });
}
