import { toast } from "react-toastify";

export default async function getEmployees() {
  return fetch("/api/employees/get", {
    method: "POST",
    body: JSON.stringify({}),
  })
    .then((x) => x.json())
    .then((x) => {
      if (!x.employees) {
        toast.error("Что-то пошло не так #9fjj3m");
        return [];
      }
      return x.employees;
    });
}
