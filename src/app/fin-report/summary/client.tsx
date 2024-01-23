"use client"

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PaymentInterface } from "../../components/types/lead";
import dayjs from "dayjs";
import { ReportSearchInterface } from "./page";
import { ExpenseInterface } from "@/types/expenses/expenseInterface";
import Filter from "./filter";
import Link from "next/link";

export default function Client(props: {
    reportData: {
        payments: PaymentInterface[]
        expenses: ExpenseInterface[]
    },
    searchParams: ReportSearchInterface

}) {
    const reportData = props.reportData;
    // const [reportData, setReportData] = useState(props.reportData)

    let totalPayments;
    if (reportData?.payments?.length) {
        totalPayments = reportData.payments.map((payment: any) => payment.sum).reduce((a: any, b: any) => a + b);
    } else {
        totalPayments = 0;
    }

    let totalExpenses;
    if (reportData?.expenses?.length) {
        totalExpenses = reportData.expenses.map((payment: any) => payment.sum).reduce((a: any, b: any) => a + b);
    } else {
        totalExpenses = 0;
    }

    const total_profit = totalPayments - totalExpenses;

    return <>
        <h1>Отчеты</h1>
        <div className="mt-4"></div>
        <div className="d-flex justify-content-between">
            <div><Filter searchParams={props.searchParams} /></div>
            <div className="d-flex align-items-center border rounded">
                <div className="p-2 border rounded bg-primary text-white">Сводка</div>
                <Link href={"/fin-report/detailing"} className="p-2 text-dark text-decoration-none">Детализация</Link>
            </div>
        </div>
        {(() => {
            const monthes = Array.from({ length: 12 }, (_, i) => i + 1);
            return <table className="table" >
                <thead>
                    <tr>
                        <th>Месяц</th>
                        <th>Доходы</th>
                        <th>Расходы</th>
                        <th>Прибыль</th>
                    </tr>
                </thead>
                <tbody>
                    {monthes.map(month => {

                        const paymentsPerMonth = reportData.payments
                            .filter(payment => dayjs(payment.created_date).format("M") === String(month))
                            .map(payment => payment.sum);
                        const paymentsPerMonthSum = (paymentsPerMonth?.length) ? paymentsPerMonth.reduce((a, b) => a + b) : 0;

                        const expenses = props.reportData.expenses
                            .filter(expense => dayjs(expense.created_date).format("M") === String(month))
                            .map(expense => expense.sum);
                        const expensesPerMonthSum = (expenses?.length) ? expenses.reduce((a, b) => a + b) : 0;

                        const profit = paymentsPerMonthSum - expensesPerMonthSum;

                        return <tr key={month}>
                            <td>{months[month - 1]}</td>
                            <td>{paymentsPerMonthSum}</td>
                            <td>{expensesPerMonthSum}</td>
                            <td>{profit}</td>
                        </tr>
                    })}
                    <tr>
                        <th>Общее</th>
                        <td>{totalPayments}</td>
                        <td>{totalExpenses}</td>
                        <td>{total_profit}</td>
                    </tr>
                </tbody>
            </table>
        })()}
    </>
}




async function fetchGetReportData(searchParams: ReportSearchInterface) {
    return fetch(
        "/api/report/get",
        {
            method: "POST",
            body: JSON.stringify({
                searchParams
            })
        }
    ).then(
        response => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error(response.statusText);
            }
        }
    ).then(data => {
        if (data.success) {
            if (!data.reportData) {
                toast.error("Что-то пошло не так #dnsnNSd3k");
            }
            return data;
        } else {
            toast.error("Что-то пошло не так");
        }
    })
        .catch(error => {
            const statusText = String(error);
            fetch(
                `/api/bugReport`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        text: {
                            err: "#dsadn3nNj",
                            data: {
                                statusText,
                                values: {}
                            }
                        }
                    })
                }
            )
                .then(x => x.json())
                .then(x => {
                    console.log(x);
                })
        })
}


const months = [
    "январь",
    "февраль",
    "март",
    "апрель",
    "май",
    "июнь",
    "июль",
    "август",
    "сентябрь",
    "октябрь",
    "ноябрь",
    "декабрь"
];