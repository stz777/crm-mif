import { PaymentCheckInterface } from "@/types/payments/PaymentCheckInterface";
import { pool } from "../connect";

export default async function getCheckByPaymentId(
  payment: number
): Promise<PaymentCheckInterface | null> {
  return pool
    .promise()
    .query("SELECT * FROM payment_checks WHERE id = ?", [payment])
    .then(([res]: any) => res.pop() || null);
}
