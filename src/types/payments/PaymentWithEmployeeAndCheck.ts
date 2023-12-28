import { Employee } from "@/app/components/types/employee";
import { PaymentInterface } from "@/app/components/types/lead";
import { PaymentCheckInterface } from "./PaymentCheckInterface";

export type PaymentWithEmployeeAndCheck = PaymentInterface & {
  employee: Employee;
} & {
  check: PaymentCheckInterface | null;
};
