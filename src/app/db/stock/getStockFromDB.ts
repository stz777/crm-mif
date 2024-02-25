import { StockInterface } from "@/app/components/types/stock";
import { pool } from "../connect";

export default async function getStockFromDB(): Promise<StockInterface[]> {
  return pool
    .promise()
    .query("SELECT * FROM stock")
    .then(([stock]: any) => stock)
    .catch((error: any) => {
      console.error("error #kkf4", error);
      return [];
    });
}
