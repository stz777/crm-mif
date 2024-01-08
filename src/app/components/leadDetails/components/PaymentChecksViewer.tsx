import { PaymentWithEmployeeAndCheck } from "@/types/payments/PaymentWithEmployeeAndCheck";
import { useState, useEffect } from "react";
import getPayments from "./getPayments";

export default function PaymentChecksViewer(props: { lead_id: number }) {
    const [payments, setPayments] = useState<PaymentWithEmployeeAndCheck[]>([]);
    const [path, setPath] = useState("");
    useEffect(() => {
        (async function req() {
            const { path, payments } = await getPayments(props.lead_id)
            setPayments(payments);
            setPath(path);
            await new Promise(r => {
                setTimeout(async () => {
                    req();
                    r(true);
                }, 3000);
            })
        })()
    }, [])
    return <>
        <table className="table">
            <tbody>
                {payments.map(payment => <tr key={payment.id}>
                    <td>{payment.employee.username}</td>
                    <td>{payment.sum}</td>
                    <td className="text-end">{(payment.check?.file_name) ?
                        <a target="blank" href={"/images//" + payment.check.file_name}>чек</a>
                        : "нет чека"}</td>
                </tr>)}
            </tbody>
        </table>
    </>
}