"use client"

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Client(props: { reportData: any }) {

    const [reportData, setReportData] = useState(props.reportData)

    useEffect(() => {
        let mount = true;
        (async function refresh() {
            if (!mount) return;
            await new Promise(resolve => { setTimeout(() => { resolve(1); }, 1000); });
            const response = await fetchGetReportData();
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

    let totalExpenses;
    if (reportData?.expensesPerLead?.length) {
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




async function fetchGetReportData() {
    return fetch(
        "/api/report/get",
        {
            method: "GET",
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