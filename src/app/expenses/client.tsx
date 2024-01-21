"use client"
import { ExpenseInterface } from "@/types/expenses/expenseInterface";
import { ExpensesCategoryInterface } from "@/types/expenses/expensesCategoryInterface";
import CategoriesEditor from "./categoriesEditor/CategoriesEditor";
import { useEffect, useState } from "react";
import ExpenseCreator from "./expenseCreator/ExpenseCreator";
import dayjs from "dayjs";
import fetchExpenses from "./fetchExpenses";

export default function Client(props: {
    expensesCategories: ExpensesCategoryInterface[],
    expenses: ExpenseInterface[]
    searchParams: any
}) {
    const [expenses, setExpenses] = useState(props.expenses);
    const [expensesCategories, setExpensesCategories] = useState(props.expensesCategories);

    useEffect(() => {
        let mount = true;
        (async function refreshData() {
            if (!mount) return;
            await new Promise(resolve => { setTimeout(() => { resolve(1); }, 1000); });
            const response = await fetchExpenses(props.searchParams);
            if (JSON.stringify(expenses) !== JSON.stringify(response.expenses)) {
                setExpenses(response.expenses);
            }
            if (JSON.stringify(expensesCategories) !== JSON.stringify(response.expensesCategories)) {
                setExpensesCategories(response.expensesCategories);
            }
            await refreshData();
        })();
        return () => { mount = false; }
    }, [expenses, expensesCategories, props.searchParams])

    return <>
        <CategoriesEditor expensesCategories={expensesCategories} />
        <ExpenseCreator expensesCategories={expensesCategories} />
        <h1>Расходы</h1>
        <table className="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Описание</th>
                    <th>Категория</th>
                    <th>Дата</th>
                    <th>Сумма</th>
                </tr>
            </thead>
            <tbody>
                {expenses.map(expense => <tr key={expense.id}>
                    <td>{expense.id}</td>
                    <td>{expense.description}</td>
                    <td>{expense.category_id}</td>
                    <td>{dayjs(expense.created_date).format("DD.MM.YYYY")}</td>
                    <td>{expense.sum}</td>
                </tr>)}
            </tbody>
        </table>
    </>
}
