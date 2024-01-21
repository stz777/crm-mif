import { ExpenseInterface } from "@/types/expenses/expenseInterface";
import { pool } from "../../connect";

export default async function getExpenses(): Promise<ExpenseInterface[]> {
    return pool.promise().query("SELECT * FROM expenses ORDER BY id DESC")
        .then(([x]: any) => x)
        .catch((error) => {
            console.error('error #fsomf0', error);
            return [];
        })
}