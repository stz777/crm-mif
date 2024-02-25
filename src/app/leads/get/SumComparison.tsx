import { PaymentInterface } from "@/app/components/types/lead";
import paymentsReducer from "./paymentsReducer";

export default function SumComparison(props: { payments: PaymentInterface[], leadSum: number }) {
    const totalSum = paymentsReducer(props.payments);
    return <div className={`text-nowrap fw-bold ` + ((props.leadSum - totalSum) ? "" : "text-success")}>
        <span style={{ fontSize: "1.2em" }}>{totalSum} из {props.leadSum}</span>
    </div>
}
