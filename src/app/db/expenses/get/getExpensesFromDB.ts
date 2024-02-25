import { ExpenseInterface } from "@/types/expenses/expenseInterface";
import { pool } from "../../connect";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { ExpensesSearchParamsInterface } from "@/app/expenses/types";
import formatDate from "@/app/stock/history/formatDate";
dayjs.extend(customParseFormat);

export default async function getExpenses(
  searchParams: ExpensesSearchParamsInterface
): Promise<ExpenseInterface[]> {
  const whereArray: string[] = [];

  if (searchParams.category)
    whereArray.push(`category_id = ${searchParams.category}`);

  if (searchParams.date_from)
    whereArray.push(
      `DATE(created_date) >= "${formatDate(searchParams.date_from)}"`
    );
  if (searchParams.date_to)
    whereArray.push(
      `DATE(created_date) <= "${formatDate(searchParams.date_to)}"`
    );

  const whereStr = whereArray.length
    ? ` WHERE ${whereArray.join(" AND ")}`
    : "";
  const qs = `SELECT * FROM expenses ${whereStr} ORDER BY id DESC`;
  return pool
    .promise()
    .query(qs)
    .then(([x]: any) => x)
    .catch((error) => {
      console.error("error #fsomf0", error);
      return [];
    });
}
