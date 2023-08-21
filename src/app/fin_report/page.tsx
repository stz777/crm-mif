import getFinReportdata from "./getFinReportdata";

export default async function Page() {
    const data = await getFinReportdata();

    let totalPayments;
    if (data.payments.length) {
        totalPayments = data.payments.map(payment => payment.sum).reduce((a, b) => a + b);
    } else {
        totalPayments = 0;
    }

    let totalExpenses;
    if (data.expensesPerLead.length) {
        totalExpenses = data.expensesPerLead.map(payment => payment.sum).reduce((a, b) => a + b);
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
        {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </>
}