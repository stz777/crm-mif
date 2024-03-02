import { toast } from "react-toastify";
import { SearchInterface } from "../types";

export default async function fetchGetSuppliersData(
  searchParams: SearchInterface
) {
  return await fetch(`/api/suppliers/get`, {
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
        return data.suppliers;
      } else {
        toast.error("Что-то пошло не так #dms8s");
      }
    })
    .catch((_) => {
      toast.error("Что-то пошло не так #chxxd8y3");
    });
}
