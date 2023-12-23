import { PaymentInterface } from "@/app/components/types/lead";
import paymentsReducer from "./paymentsReducer";

export default function SumComparison(props: { payments: PaymentInterface[], leadSum: number }) {
    const totalSum = paymentsReducer(props.payments);
    return <div className={`fw-bold ` + ((props.leadSum - totalSum) ? "" : "text-success")}>
        {totalSum} из <span>{props.leadSum}</span>
    </div>
}
