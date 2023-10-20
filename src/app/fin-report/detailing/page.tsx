import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserByToken } from "../../components/getUserByToken";
// import Client from "./client";
// import Filter from "./filter";
import getPayments from "./getPayments";
import { ExpensesPePerPurchaseTaskInterface, PaymentInterface } from "@/app/components/types/lead";
import dayjs from "dayjs";
import getExpensesPerPurchaseTask from "./getExpensesPerPurchaseTask";

export default async function Page(props: { searchParams: { from?: string, to?: string } }) {
    const auth = cookies().get('auth');
    if (!auth?.value) return redirect("/");
    const user = await getUserByToken(auth?.value);
    if (!user) return redirect("/");
    if (!user.is_boss) return redirect("/");

    // const data = await getFinReportdata(props.searchParams);
    const payments = await getPayments(props.searchParams);

    const expensesPerPurchaseTask = await getExpensesPerPurchaseTask(props.searchParams)

    return <>
        <h1>Отчет (детализация)</h1>
        {/* <pre>{JSON.stringify(props.searchParams, null, 2)}</pre> */}

        <div className="row">
            <div className="col">
                <h2>Доходы</h2>
                <Payments payments={payments} />
            </div>
            <div className="col">
                <h2>Закупки</h2>
                <Expenses expenses={expensesPerPurchaseTask} />
            </div>
        </div>
        
    </>
}

function Payments(props: { payments: PaymentInterface[] }) {
    return <>
        <table className="table bable-striped table-bordered">
            <thead className="sticky-top">
                <tr>
                    <th>сумма</th>
                    <th>дата</th>
                </tr>
            </thead>
            <tbody>
                {props.payments.map(payment => <tr key={payment.id}>
                    <td>{payment.sum}</td>
                    <td>{dayjs(payment.created_date).format("DD.MM.YYYY hh:mm")}</td>
                </tr>)}
            </tbody>
        </table>
    </>
}

function Expenses(props: { expenses: ExpensesPePerPurchaseTaskInterface[] }) {
    return <>
        <table className="table bable-striped table-bordered">
            <thead className="sticky-top">
                <tr>
                    <th>сумма</th>
                    <th>дата</th>
                </tr>
            </thead>
            <tbody>
                {props.expenses.map(payment => <tr key={payment.id}>
                    <td>{payment.sum}</td>
                    <td>{dayjs(payment.created_date).format("DD.MM.YYYY hh:mm")}</td>
                </tr>)}
            </tbody>
        </table>
    </>
}
