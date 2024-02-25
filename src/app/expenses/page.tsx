import Client from "./client";
import getExpenses from "../db/expenses/get/getExpensesFromDB";
import getExpenseCategories from "../db/expenses-categories/get/getExpenseCategories";
import { ExpensesSearchParamsInterface } from "./types";

export default async function Page(props: { searchParams: ExpensesSearchParamsInterface; }) {
    const { searchParams } = props;
    const expensesCategories = await getExpenseCategories();
    const expenses = await getExpenses(searchParams);
    return <>
        <Client expensesCategories={expensesCategories} expenses={expenses} searchParams={searchParams} />
    </>
}