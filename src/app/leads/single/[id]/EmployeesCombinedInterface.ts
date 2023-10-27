import { Employee } from "@/app/components/types/employee";

type EmployeesCombinedInterface = Employee & {
    role: number
};

export default EmployeesCombinedInterface;