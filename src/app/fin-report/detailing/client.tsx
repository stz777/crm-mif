"use client"

import { PaymentInterface } from "../../components/types/lead";
import dayjs from "dayjs";
import { ExpenseInterface } from "@/types/expenses/expenseInterface";
import Filter from "./filter";
import Link from "next/link";

export default function Client(props: {
    reportData: {
        payments: PaymentInterface[]
        expenses: ExpenseInterface[]
    },
    searchParams: any
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
                <Link href={"/fin-report/summary"} className="p-2 text-dark text-decoration-none">Сводка</Link>
                <div className="p-2 border rounded bg-primary text-white">Детализация</div>
            </div>
        </div>
        <div className="mt-3"></div>
        {(() => {
            const monthes = Array.from({ length: 12 }, (_, i) => i + 1);

            return <div className="row">
                <div className="col-6">
                    <h4>Доходы</h4>
                    <table className="table border">
                        <thead>
                            <tr>
                                <th>Всего</th>
                                <th className="text-end text-success">{totalPayments}</th>
                            </tr>
                            <tr>
                                <th>Дата</th>
                                <th className="text-end">Сумма</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.payments.map(payment => <tr key={payment.id}>
                                <td>{dayjs(payment.created_date).format("DD.MM.YYYY")}</td>
                                <td className="text-end text-success">+ {payment.sum} р</td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>
                <div className="col-6">
                    <h4>Расходы</h4>
                    <table className="table border">
                        <thead>
                        <tr>
                                <th>Всего</th>
                                <th className="text-end text-success">{totalExpenses}</th>
                            </tr>
                            <tr>
                                <th>Дата</th>
                                <th className="text-end">Сумма</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.expenses.map(expense => <tr key={expense.id}>
                                <td>{dayjs(expense.created_date).format("DD.MM.YYYY")}</td>
                                <td className="text-end text-danger">- {expense.sum} р</td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>
            </div>
        })()}
    </>
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