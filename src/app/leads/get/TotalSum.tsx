import { PaymentInterface } from "@/app/components/types/lead";

export default function TotalSum(props: { payments: PaymentInterface[], leadSum: number }) {
    let totalSum = 0;
    if (props.payments?.length) {
        totalSum = props.payments
            .map(({ sum }) => sum)
            .reduce((a, b) => a + b);
    }
    totalSum = 1200;
    return <div className={`fw-bold ` + ((props.leadSum - totalSum) ? "" : "text-success")}>
        {totalSum} из <span>{props.leadSum}</span>
    </div>
}