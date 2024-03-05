import { EmployeeMeta } from "@/app/employees/types";
import { pool } from "../connect";

export default async function getEmploeeMetaFromDB(
  employeeId: number
): Promise<EmployeeMeta[]> {
  return pool
    .promise()
    .query("select * from employees_meta where employee_id = ?", [employeeId])
    .then(([x]: any) => x)
    .catch((error) => {
      console.error("error #kdd87", error);
      return [];
    });
}
