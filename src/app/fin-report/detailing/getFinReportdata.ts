import getExpenses from "@/app/db/expenses/get/getExpensesFromDB";
import { PaymentInterface } from "../../components/types/lead";
import { pool } from "../../db/connect";
import dayjs from "dayjs";

export default async function getFinReportdata(searchParams: any) {
  const payments = await getPayments(searchParams);
  const expenses = await getExpenses(searchParams);
  return {
    payments,
    expenses,
  };
}

async function getPayments(searchParams: any): Promise<PaymentInterface[]> {
  const whereArr: string[] = [];

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

  const qs = `SELECT * FROM payments ${whereStr} ORDER BY id DESC`;

  return pool
    .promise()
    .query(qs)
    .then(([payments]: any) => payments)
    .catch((error) => {
      console.error("error #fjfud", error);
      return [];
    });
}
