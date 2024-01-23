"use client"
import { toast } from "react-toastify";
import Filter from "./filter";
import { useEffect, useState } from "react";
import { PaymentInterface } from "@/app/components/types/lead";
import dayjs from "dayjs";

export default function Client(props: {
    searchParams: {
        year: string,
        month: string,
    }
}) {

    const [data, setData]: any = useState();

    useEffect(() => {

        if (props.searchParams.month && props.searchParams.year) {
            console.log('asdas', props.searchParams.month, props.searchParams.year);
            fetch(
                "/api/report/get/detailing",
                {
                    method: "POST",
                    body: JSON.stringify(
                        props.searchParams
                    )
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
                    setData(data.data);
                } else {
                    toast.error("Что-то пошло не так");
                }
            })
                .catch(error => {
                    toast.error("Что-то пошло не так");
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
                                    err: "#jdsccn*d",
                                    data: {
                                        statusText,
                                    }
                                }
                            })
                        }
                    )
                        .then(x => x.json())
                        .then(x => {
                            console.log(x);
                        })
                });
        }

    }, [props])

    return <>
        <Filter searchParams={props.searchParams} />

        {data ? <div className="row">
            <div className="col">
                <h2>Доходы</h2>
                <Payments payments={data.payments} />
            </div>
            <div className="col">
                <h2>Закупки</h2>
                <Expenses expenses={data.expensesPerPurchaseTask} />
            </div>
        </div> : null}
    </>

}

function Payments(props: { payments: PaymentInterface[] }) {
    let total = 0;

    if (props.payments.length) {
        total = props.payments.map(item => item.sum).reduce((a, b) => a + b)
    }
    return <>
        <table className="table bable-striped table-bordered">
            <thead className="sticky-top">
                <tr>
                    <th>дата</th>
                    <th>сумма</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th>всего</th>
                    <th>{total}</th>
                </tr>
                {props.payments.map(payment => <tr key={payment.id}>
                    <td className="text-nowrap">{dayjs(payment.created_date).format("DD.MM.YYYY hh:mm")}</td>
                    <td>{payment.sum}</td>
                </tr>)}
            </tbody>
        </table>
    </>
}

function Expenses(props: { expenses: any }) {

    let total = 0;

    if (props.expenses.length) {
        // total = props.expenses.map(item => item.sum).reduce((a, b) => a + b)
    }

    return <>
        <table className="table bable-striped table-bordered">
            <thead className="sticky-top">
                <tr>
                    <th>дата</th>
                    <th>сумма</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th>всего </th>
                    <td>{total}</td>
                </tr>
                {/* {props.expenses.map(payment => <tr key={payment.id}>
                    <td className="text-nowrap">{dayjs(payment.created_date).format("DD.MM.YYYY hh:mm")}</td>
                    <td>{payment.sum}</td>
                </tr>)} */}
            </tbody>
        </table>
    </>
}
