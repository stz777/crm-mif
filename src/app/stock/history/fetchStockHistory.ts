import { toast } from "react-toastify";
import { SearchParamsInterface } from "./types";

export default async function fetchStockHistory(
  searchParams: SearchParamsInterface
) {
  return fetch("/api/stock/get-history", {
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
    .then((data) => {
      if (data.success) {
        if (!data.stockHistory) {
          toast.error("Что-то пошло не так #m453n7z");
        }
        return data;
      } else {
        toast.error("Что-то пошло не так #v568v7b");
      }
    })
    .catch((error) => {
      toast.error("Что-то пошло не так #f884hh");
      console.log("error", error);
    });
}
