import { pool } from "../connect";

export default async function insertMaterialToStockDB(
  material: string,
  count: number
): Promise<number> {
  console.log(material, count);
  return pool
    .promise()
    .query("INSERT INTO stock (material, count) VALUES (?,?)", [
      material,
      count,
    ])
    .then(([data]: any) => {
      console.log("data");
      return data.insertId;
    })
    .catch((error: any) => {
      console.error("error #fjf8", error);
      return 0;
    });
}
