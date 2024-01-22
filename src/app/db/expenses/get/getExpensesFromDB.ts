import { ExpenseInterface } from "@/types/expenses/expenseInterface";
import { pool } from "../../connect";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export default async function getExpenses(
  searchParams: any
): Promise<ExpenseInterface[]> {
  const whereArr: string[] = [];

  if (searchParams.category) {
    whereArr.push(`category_id = ${searchParams.category}`);
  }

  if (searchParams.date_from) {
    const date = dayjs(searchParams.date_from, "DD.MM.YYYY");
    const day = dayjs(date).format("DD");
    whereArr.push(`DAY(created_date) >= ${day}`);
    const month = date.format("MM");
    whereArr.push(`MONTH(created_date) >= ${month}`);
    const year = date.format("YYYY");
    whereArr.push(`YEAR(created_date) >= ${year}`);
  }

  if (searchParams.date_to) {
    const date = dayjs(searchParams.date_to, "DD.MM.YYYY");
    const day = dayjs(date).format("DD");
    whereArr.push(`DAY(created_date) <= ${day}`);
    const month = date.format("MM");
    whereArr.push(`MONTH(created_date) <= ${month}`);
    const year = date.format("YYYY");
    whereArr.push(`YEAR(created_date) <= ${year}`);
  }

  const whereStr = whereArr.length ? ` WHERE ${whereArr.join(" AND ")}` : "";

  return pool
    .promise()
    .query(`SELECT * FROM expenses ${whereStr} ORDER BY id DESC`)
    .then(([x]: any) => x)
    .catch((error) => {
      console.error("error #fsomf0", error);
      return [];
    });
}
