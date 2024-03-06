import { LeadsByEmployeeInterface } from "@/app/api/employees/get-leads/[employeeId]/route";
import { toast } from "react-toastify";

export default async function fetchGetLeadsByEmployeeId(employeeId: number) {
  return fetch(`/api/employees/get-leads/${employeeId}`, {
    method: "POST",
    body: JSON.stringify({ employeeId }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    })
    .then((data: { success: boolean; leads: LeadsByEmployeeInterface[] }) => {
      if (data.success) {
        return data.leads;
      } else {
        toast.error("Что-то пошло не так #m386");
      }
    })
    .catch((_) => {
      toast.error("Что-то пошло не так #vj764");
      return [];
    });
}
