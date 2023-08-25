"use client"

import { useEffect, useState } from "react";

export default function Client(props: { reportData: any }) {

    const [reportData, setReportData] = useState(props.reportData)

    useEffect(() => {

    }, [props, reportData])


    let totalPayments;
    if (reportData.payments.length) {
        totalPayments = reportData.payments.map((payment: any) => payment.sum).reduce((a: any, b: any) => a + b);
    } else {
        totalPayments = 0;
    }

    let totalExpenses;
    if (reportData.expensesPerLead.length) {
        totalExpenses = reportData.expensesPerLead.map((payment: any) => payment.sum).reduce((a: any, b: any) => a + b);
    } else {
        totalExpenses = 0;
    }

    const profit = totalPayments - totalExpenses;

    return <>
        <h1>Отчет</h1>
        <table className="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>Доходы</th>
                    <th>Расходы</th>
                    <th>Прибыль</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{totalPayments}</td>
                    <td>{totalExpenses}</td>
                    <td>{profit}</td>
                </tr>
            </tbody>
        </table>
        {/* <pre>{JSON.stringify(reportData, null, 2)}</pre> */}
    </>
}

interface ReportdataInterface {

}