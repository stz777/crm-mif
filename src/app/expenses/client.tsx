"use client"
import { ExpenseInterface } from "@/types/expenses/expenseInterface";
import { ExpensesCategoryInterface } from "@/types/expenses/expensesCategoryInterface";
import CategoriesEditor from "./categoriesEditor/CategoriesEditor";
import { useEffect, useState } from "react";
import ExpenseCreator from "./expenseCreator/ExpenseCreator";

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
        <div>категории</div>
        <pre>{JSON.stringify(expensesCategories, null, 2)}</pre>
        <div>расходы</div>
        <pre>{JSON.stringify(expenses, null, 2)}</pre>
    </>
}

async function fetchExpenses(searchParams: any) {
    return fetch(
        "/api/expenses/get",
        {
            method: "post",
            body: JSON.stringify(searchParams)
        }
    )
        .then(x => x.json())
        .then(x => {
            return x;
        })
}
