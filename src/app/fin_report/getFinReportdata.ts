import { sendMessageToTg } from "../api/bugReport/sendMessageToTg";
import { ExpensesPePerPurchaseTaskInterface, ExpensesPerLeadInterface, PaymentInterface } from "../components/types/lead";
import { pool } from "../db/connect";
import { ReportSearchInterface } from "./page";

export default async function getFinReportdata(searchParams: ReportSearchInterface) {
    const payments = await getPayments(searchParams);
    const expensesPerLead = await getExpensesPerLead(searchParams);
    const expenses_per_purchase_task = await getExpensesPerPurchaseTask(searchParams)
    return {
        payments,
        expensesPerLead,
        expenses_per_purchase_task
    };
}

async function getPayments(props: { year?: number }): Promise<PaymentInterface[]> {

    return await new Promise(resolve => {

        const whereArray: [string, string, string][] = [];
        if (props?.year) {
            whereArray.push(["YEAR(created_date)", "=", String(props.year)])
        }
        const whereString = !whereArray.length
            ? ""
            : ("WHERE " + whereArray.map(([i1, i2, i3]) => `${i1} ${i2} ${i3}`).join(" AND "));

        const qs = `SELECT * FROM payments ${whereString} `;

        pool.query(
            qs,
            function (err: any, res: PaymentInterface[]) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify({
                            error: err,
                            code: "#kd9d7dh3mnhH"
                        }, null, 2),
                        "5050441344"
                    )
                }
                resolve(res ? res : []);
            }
        )
    })
}

async function getExpensesPerLead(props: { year?: number }): Promise<ExpensesPerLeadInterface[]> {
    const whereArray: [string, string, string][] = [];
    if (props?.year) {
        whereArray.push(["YEAR(created_date)", "=", String(props.year)])
    }
    const whereString = !whereArray.length
        ? ""
        : ("WHERE " + whereArray.map(([i1, i2, i3]) => `${i1} ${i2} ${i3}`).join(" AND "));

    const qs = `SELECT * FROM expenses_per_lead ${whereString}`;


    return await new Promise(resolve => {
        pool.query(
            qs,
            function (err: any, res: ExpensesPerLeadInterface[]) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify({
                            error: err,
                            code: "#d8djdn3n3"
                        }, null, 2),
                        "5050441344"
                    )
                }
                resolve(res ? res : []);
            }
        )
    })
}

async function getExpensesPerPurchaseTask(props: { year?: number }): Promise<ExpensesPePerPurchaseTaskInterface[]> {

    const whereArray: [string, string, string][] = [];
    if (props?.year) {
        whereArray.push(["YEAR(created_date)", "=", String(props.year)])
    }
    const whereString = !whereArray.length
        ? ""
        : ("WHERE " + whereArray.map(([i1, i2, i3]) => `${i1} ${i2} ${i3}`).join(" AND "));

    const qs = `SELECT * FROM expenses_per_purchase_task ${whereString}`;
    return await new Promise(resolve => {
        pool.query(
            qs,
            function (err: any, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify({
                            error: err,
                            code: "#dmsnanNjdu8"
                        }, null, 2),
                        "5050441344"
                    )
                }
                resolve(res ? res : []);
            }
        )
    })
}