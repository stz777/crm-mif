import { toast } from "react-toastify";

export default async function fetchStockHistory() {
  return fetch("/api/stock/get", {
    method: "POST",
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
        if (!data.stock) {
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
