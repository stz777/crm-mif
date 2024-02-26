import { pool } from "@/app/db/connect";
import { SearchParamsInterface } from "./types";
import formatDate from "./formatDate";
import { StockHistory } from "@/app/components/types/stock";

export default async function getStockHistoryFromDB(
  searchParams: SearchParamsInterface
): Promise<StockHistory[]> {
  const arr = [];

  if (searchParams.is_adjunction)
    arr.push(
      `stock_history.is_adjunction = ${Number(searchParams.is_adjunction)}`
    );

  if (searchParams.date_from)
    arr.push(
      `DATE(stock_history.created_date) >= "${formatDate(
        searchParams.date_from
      )}"`
    );
  if (searchParams.date_to)
    arr.push(
      `DATE(stock_history.created_date) <= "${formatDate(
        searchParams.date_to
      )}"`
    );

  const whereSubStr = arr.length ? " WHERE " + arr.join(" AND ") : "";
  const qs = `SELECT stock_history.*, employees.username, stock.material AS material_name FROM stock_history
INNER JOIN employees ON employees.id = stock_history.done_by
INNER JOIN stock ON stock.id = stock_history.material
${whereSubStr}
`;

  return pool
    .promise()
    .query(qs)
    .then(([res]: any) => res)
    .catch((error: any) => {
      console.error("error #fjfdsfn", error);
      return [];
    });
}
