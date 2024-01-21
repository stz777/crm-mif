import { ExpensesCategoryInterface } from "@/types/expenses/expensesCategoryInterface";
import { pool } from "../../connect";

export default async function getExpenseCategories(
  searchParams: any
): Promise<ExpensesCategoryInterface[]> {
  return pool
    .promise()
    .query("SELECT * FROM expenses_categories")
    .then(([x]: any) => x)
    .catch((error) => {
      console.error("error #fmfmf0", error);
      return [];
    });
}
