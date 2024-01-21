import { ExpensesCategoryInterface } from "@/types/expenses/expensesCategoryInterface";
import { pool } from "../db/connect";
import Client from "./client";
import { ExpenseInterface } from "@/types/expenses/expenseInterface";
import getExpenses from "../db/expenses/get/getExpensesFromDB";
import getExpenseCategories from "../db/expenses-categories/get/getExpenseCategories";

export default async function Page(props: { searchParams: any; }) {
    const { searchParams } = props;

    const expensesCategories = await getExpenseCategories(searchParams);
    const expenses = await getExpenses();

    return <>
        <Client expensesCategories={expensesCategories} expenses={expenses} searchParams={searchParams} />
    </>
}

