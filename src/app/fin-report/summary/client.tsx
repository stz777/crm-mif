"use client"

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ExpensesPePerPurchaseTaskInterface, ExpensesPerLeadInterface, PaymentInterface } from "../../components/types/lead";
import dayjs from "dayjs";
import { ReportSearchInterface } from "./page";

export default function Client(props: {
    reportData: {
        payments: PaymentInterface[]
        expensesPerLead: ExpensesPerLeadInterface[]
        expenses_per_purchase_task: ExpensesPePerPurchaseTaskInterface[]
    },
    searchParams: ReportSearchInterface

}) {

    const [reportData, setReportData] = useState(props.reportData)

    useEffect(() => {
        let mount = true;
        (async function refresh() {
            if (!mount) return;
            await new Promise(resolve => { setTimeout(() => { resolve(1); }, 1000); });
            const response = await fetchGetReportData(props.searchParams);
            if (JSON.stringify(reportData) !== JSON.stringify(response.reportData)) setReportData(response.reportData)
            await refresh();
        })();
        return () => { mount = false; }
    }, [props, reportData])

    let totalPayments;
    if (reportData?.payments?.length) {
        totalPayments = reportData.payments.map((payment: any) => payment.sum).reduce((a: any, b: any) => a + b);
    } else {
        totalPayments = 0;
    }

    let totalExpensesPerLeads;
    if (reportData?.expensesPerLead?.length) {
        totalExpensesPerLeads = reportData.expensesPerLead.map((payment: any) => payment.sum).reduce((a: any, b: any) => a + b);
    } else {
        totalExpensesPerLeads = 0;
    }

    let totalExpensesPerPurchaseTaskInterface;
    if (reportData?.expenses_per_purchase_task?.length) {
        totalExpensesPerPurchaseTaskInterface = reportData.expenses_per_purchase_task.map((payment: any) => payment.sum).reduce((a: any, b: any) => a + b);
    } else {
        totalExpensesPerPurchaseTaskInterface = 0;
    }
    const total_balance = totalPayments - totalExpensesPerPurchaseTaskInterface;
    const total_profit = totalPayments - totalExpensesPerLeads;

    return <>
        <h1>Отчет (сводка)</h1>
        {(() => {
            const monthes = Array.from({ length: 12 }, (_, i) => i + 1);
            return <table className="table table-bordered table-striped" >
                <thead>
                    <tr>
                        <th></th>
                        <th>доходы</th>
                        <th>расходы</th>
                        <th>прибыль</th>
                        <th>закупки</th>
                        <th>баланс</th>
                    </tr>
                </thead>
                <tbody>
                    {monthes.map(month => {

                        const paymentsPerMonth = reportData.payments
                            .filter(payment => dayjs(payment.created_date).format("M") === String(month))
                            .map(payment => payment.sum);
                        const paymentsPerMonthSum = (paymentsPerMonth?.length) ? paymentsPerMonth.reduce((a, b) => a + b) : 0;

                        const expensesPerLeadsPerMonth = reportData.expensesPerLead
                            .filter(expense => dayjs(expense.created_date).format("M") === String(month))
                            .map(expense => expense.sum);
                        const expensesPerLeadsPerMonthSum = (expensesPerLeadsPerMonth?.length) ? expensesPerLeadsPerMonth.reduce((a, b) => a + b) : 0;

                        const totalExpensesPerPurchaseTaskPerMonth = reportData.expenses_per_purchase_task
                            .filter(expense => dayjs(expense.created_date).format("M") === String(month))
                            .map(expense => expense.sum);
                        const totalExpensesPerPurchaseTaskPerMonthSum = (totalExpensesPerPurchaseTaskPerMonth?.length) ? totalExpensesPerPurchaseTaskPerMonth.reduce((a, b) => a + b) : 0;
                        const profit = paymentsPerMonthSum - expensesPerLeadsPerMonthSum;
                        const balance = paymentsPerMonthSum - totalExpensesPerPurchaseTaskPerMonthSum;

                        return <tr key={month}>
                            <td>{months[month - 1]}</td>
                            <td>{paymentsPerMonthSum}</td>
                            <td>{expensesPerLeadsPerMonthSum}</td>
                            <td>{profit}</td>
                            <td>{totalExpensesPerPurchaseTaskPerMonthSum}</td>
                            <td>{balance}</td>
                        </tr>
                    })}
                    <tr>
                        <th>Общее</th>
                        <td>{totalPayments}</td>
                        <td>{totalExpensesPerLeads}</td>
                        <td>{total_profit}</td>
                        <td>{totalExpensesPerPurchaseTaskInterface}</td>
                        <td>{total_balance}</td>
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