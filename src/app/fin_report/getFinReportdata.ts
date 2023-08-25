import { sendMessageToTg } from "../api/bugReport/sendMessageToTg";
import { ExpensesPePerPurchaseTaskInterface, ExpensesPerLeadInterface, PaymentInterface } from "../components/types/lead";
import { pool } from "../db/connect";

export default async function getFinReportdata() {
    const payments = await getPayments();
    const expensesPerLead = await getExpensesPerLead();
    const expenses_per_purchase_task = await getExpensesPerPurchaseTask()
    return {
        payments,
        expensesPerLead,
        expenses_per_purchase_task
    };
}

async function getPayments(): Promise<PaymentInterface[]> {
    return await new Promise(resolve => {
        pool.query(
            "SELECT * FROM payments",
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

async function getExpensesPerLead(): Promise<ExpensesPerLeadInterface[]> {
    return await new Promise(resolve => {
        pool.query(
            "SELECT * FROM expenses_per_lead",
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

async function getExpensesPerPurchaseTask(): Promise<ExpensesPePerPurchaseTaskInterface[]> {
    return await new Promise(resolve => {
        pool.query(
            "SELECT * FROM expenses_per_purchase_task",
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