import { PaymentWithEmployeeAndCheck } from "@/types/payments/PaymentWithEmployeeAndCheck";

export default async function getPayments(
  lead_id: number
): Promise<{
  success: boolean;
  payments: PaymentWithEmployeeAndCheck[];
  path: string;
}> {
  return fetch(`/api/payments/get-payment-checks-by-lead-id/${lead_id}`)
    .then((x) => x.json())
    .then((x: any) => x);
}
