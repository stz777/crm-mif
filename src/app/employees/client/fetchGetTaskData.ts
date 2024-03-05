import { toast } from "react-toastify";
import { SearchParamsInterface } from "../types";

export default async function fetchGetTaskData(
  searchParams: SearchParamsInterface
) {
  return await fetch(`/api/employees/get`, {
    method: "POST",
    body: JSON.stringify(searchParams),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    })
    .then((data: any) => {
      if (data.success) {
        return data.employees;
      } else {
        toast.error("Что-то пошло не так #mc884");
      }
    })
    .catch((_) => {
      toast.error("Что-то пошло не так #nv98");
    });
}
