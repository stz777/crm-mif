import { PaymentInterface } from "@/app/components/types/lead";

export default function paymentsReducer(payments: PaymentInterface[]): number {
    let totalSum = 0;
    if (payments?.length) {
        totalSum = payments
            .map(({ sum }) => sum)
            .reduce((a, b) => a + b);
    }
    return totalSum;
}