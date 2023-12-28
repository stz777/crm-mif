import getEployeeByID from "@/app/db/employees/getEployeeById";
import getCheckByPaymentId from "@/app/db/payments/getCheckByPaymentId";
import { getPaymentsByLeadId } from "@/app/db/payments/getPaymentsByLeadId";
import { PaymentWithEmployeeAndCheck } from "@/types/payments/PaymentWithEmployeeAndCheck";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  p: { params: { lead_id: string } }
) {
  const lead_id = Number(p.params.lead_id);

  const pymentsWithEmployeeAndCheck: PaymentWithEmployeeAndCheck[] = [];

  const payments = await getPaymentsByLeadId(lead_id);

  for (let index = 0; index < payments.length; index++) {
    const payment = payments[index];
    const employee = await getEployeeByID(payment.done_by);
    const check = await getCheckByPaymentId(payment.id);

    pymentsWithEmployeeAndCheck.push({
      ...payment,
      employee,
      check,
    });
  }

  return NextResponse.json({
    success: true,
    payments,
    pymentsWithEmployeeAndCheck,
  });
}
